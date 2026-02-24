import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authenticate } from "@/lib/auth";
import connectDB from "@/lib/db";
import { runGroqAction } from "@/lib/ai-handler";

// Initialize OpenAI and Gemini
console.log("🛠️ Initializing secondary AI clients...");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper to extract JSON from potentially markdown-wrapped responses
function extractJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      try {
        return JSON.parse(match[1].trim());
      } catch (e) {
        console.warn("⚠️ Failed to parse markdown block JSON, trying regex...");
      }
    }
    const jsonMatch = text.match(/\{[\s\S]*"question"[\s\S]*"answer"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        throw new Error("Could not parse extracted JSON object pattern");
      }
    }
    throw new Error("Could not extract JSON from AI response: " + text.substring(0, 100));
  }
}

export async function POST(req) {
  try {
    console.log("📥 Received request for quiz question...");
    await connectDB();
    const user = await authenticate(req);
    console.log("✅ User authenticated:", user.email);

    const body = await req.json();
    const {
      topic = "general knowledge",
      subject = null,
      category = null,
      subCategory = null,
      seenQuestions = []
    } = body;

    // Bulletproof difficulty
    const difficultyLevel = (typeof body.difficulty === "string" ? body.difficulty : "medium").toUpperCase();

    const contextParts = [subject, category, subCategory, topic].filter(Boolean);
    const selectedTopic = contextParts.length > 0 ? contextParts.join(" > ") : (topic || "general knowledge");

    const difficultyDescriptions = {
      easy: "simple, basic factual, one-line answers",
      medium: "intermediate, concepts, categories, comparisons",
      hard: "advanced, deep dives, real-world challenges, complex problem solving",
    };
    const difficultyLabel = difficultyDescriptions[difficultyLevel.toLowerCase()] || difficultyDescriptions.medium;

    const recentSeen = Array.isArray(seenQuestions) ? seenQuestions.slice(-150) : [];
    let avoidClause = "";
    if (recentSeen.length > 0) {
      avoidClause = `\n\nCRITICAL: DO NOT repeat any of these previously asked questions:\n${recentSeen.map((q, i) => `${i + 1}. ${q}`).join("\n")}`;
    }

    const prompt = `You are a professional quiz examiner. Generate ONE unique quiz question for the topic: "${selectedTopic}".
Difficulty Level: ${difficultyLevel} (${difficultyLabel}).

Strict Guidelines:
1. Return ONLY a valid JSON object.
2. Format: {"question": "...", "answer": "..."}
3. Do NOT include any intro or outro text.
${avoidClause}`;

    let content = null;
    let fallbackUsed = null;
    let errorChain = [];

    // LAYER 1: GROQ (Multi-Key Chain)
    try {
      console.log("🚀 Layer 1: Attempting Groq Multi-Key Chain...");
      const completion = await runGroqAction((groq, model) =>
        groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: model,
          temperature: 0.7,
        })
      );
      content = completion.choices[0]?.message?.content;
      if (content) console.log("✅ Success: Groq Chain (llama-3.3-70b-versatile)");
    } catch (groqChainError) {
      errorChain.push(`Groq Chain failed: ${groqChainError.message}`);

      // LAYER 2: OPENAI
      try {
        console.log("🚀 Layer 2: Attempting OpenAI (gpt-4o)...");
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-4o",
          temperature: 0.7,
          response_format: { type: "json_object" },
        });
        content = completion.choices[0]?.message?.content;
        fallbackUsed = "OpenAI (gpt-4o)";
        if (content) console.log("✅ Success: OpenAI (gpt-4o)");
      } catch (openaiError) {
        errorChain.push(`OpenAI(gpt-4o) failed: ${openaiError.message}`);

        try {
          console.log("🚀 Layer 2b: Attempting OpenAI (gpt-3.5-turbo)...");
          const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            temperature: 0.7,
          });
          content = completion.choices[0]?.message?.content;
          fallbackUsed = "OpenAI (gpt-3.5-turbo)";
          if (content) console.log("✅ Success: OpenAI (gpt-3.5-turbo)");
        } catch (openaiError2) {
          errorChain.push(`OpenAI(gpt-3.5-turbo) failed: ${openaiError2.message}`);

          console.log("⏩ OpenAI exhausted. Falling back to Gemini...");

          // LAYER 3: GEMINI (Last Resort)
          const geminiModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.5-flash-8b"];
          for (const modelId of geminiModels) {
            try {
              console.log(`🚀 Layer 3: Attempting Gemini (${modelId})...`);
              const model = genAI.getGenerativeModel({ model: modelId });
              const result = await model.generateContent(prompt);
              content = result.response.text();
              fallbackUsed = `Gemini (${modelId})`;
              if (content) {
                console.log(`✅ Success: ${fallbackUsed}`);
                break;
              }
            } catch (gemError) {
              errorChain.push(`Gemini(${modelId}) failed: ${gemError.message}`);
            }
          }
        }
      }
    }

    if (!content) {
      console.warn("🔻 EMERGENCY: All AI services failed. Using static fallback pool.");
      const staticPool = [
        { question: "What is the capital of France?", answer: "Paris" },
        { question: "Who developed the theory of relativity?", answer: "Albert Einstein" },
        { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
        { question: "Which element has the chemical symbol 'O'?", answer: "Oxygen" },
        { question: "What is the power house of the cell?", answer: "Mitochondria" }
      ];
      const randomQ = staticPool[Math.floor(Math.random() * staticPool.length)];
      return NextResponse.json({
        ...randomQ,
        user: { username: user.username },
        source: "Emergency Static Pool",
        version: "V8_MULTI_KEY_GROQ"
      });
    }

    const parsed = extractJSON(content);

    console.log("-----------------------------------------");
    console.log(`📝 GENERATED QUIZ [${fallbackUsed || "Groq"}]:`);
    console.log(`❓ Q: ${parsed.question}`);
    console.log(`💡 A: ${parsed.answer}`);
    console.log("-----------------------------------------");

    return NextResponse.json({
      question: parsed.question || "Fallback: What is the capital of India?",
      answer: parsed.answer || "New Delhi",
      user: { username: user.username },
      source: fallbackUsed || "Groq",
      version: "V8_MULTI_KEY_GROQ"
    });

  } catch (error) {
    console.error("❌ FINAL API ERROR:", error.message);
    return NextResponse.json({
      message: error.message,
      version: "V8_MULTI_KEY_GROQ",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 503 });
  }
}

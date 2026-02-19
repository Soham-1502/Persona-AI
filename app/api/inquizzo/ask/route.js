import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { authenticate } from "@/lib/auth";
import connectDB from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper to extract JSON from potentially markdown-wrapped responses
function extractJSON(text) {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Extract from markdown code blocks like ```json {...} ```
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return JSON.parse(match[1].trim());
    }
    // Try to find JSON object pattern in the text
    const jsonMatch = text.match(/\{[\s\S]*"question"[\s\S]*"answer"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not extract JSON from response");
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticate(req);
    console.log("✅ User authenticated:", user.email);

    const { topic, subject, category, seenQuestions = [] } = await req.json();
    console.log("📋 Topic:", topic, "| Seen questions count:", seenQuestions.length);

    const selectedTopic = topic || subject || category || "general knowledge";

    // Include last 30 seen questions in prompt to avoid repeats
    const recentSeen = seenQuestions.slice(-30);
    let avoidClause = "";
    if (recentSeen.length > 0) {
      avoidClause = `\n\nDO NOT generate any of these previously asked questions:\n${recentSeen.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nGenerate a COMPLETELY DIFFERENT question that is NOT similar to any of the above.`;
    }

    const prompt = `Generate ONE unique ${selectedTopic} quiz question with its answer in JSON format ONLY. No markdown, no extra text.
Format: {"question": "What is...?", "answer": "The answer"}${avoidClause}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    console.log("🤖 Groq raw response:", content);

    const parsed = extractJSON(content);

    return NextResponse.json({
      question: parsed.question || "What is 2+2?",
      answer: parsed.answer || "4",
      user: {
        username: user.username,
      },
    });
  } catch (error) {
    console.error("❌ Generate question error:", error.message);

    if (error.message.includes("Authentication") || error.message.includes("token")) {
      return NextResponse.json(
        { message: "Authentication failed. Please login again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: `Failed to generate question: ${error.message}` },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { authenticate } from "@/lib/auth";
import connectDB from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    await connectDB();
    console.log("✅ DB connected");

    const user = await authenticate(req);
    console.log("✅ User authenticated:", user.email);

    const { topic, subject, category } = await req.json();
    console.log("📋 Topic:", topic, subject, category);

    const selectedTopic = topic || subject || category || "general knowledge";

    // Check if question was already seen
    const prompt = `Generate ONE unique ${selectedTopic} quiz question with its answer in JSON format. 
Format: {"question": "What is...?", "answer": "The answer"}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // ✅ Updated model
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    // Mark question as seen
    if (parsed.question && !user.seenQuestions.includes(parsed.question)) {
      user.seenQuestions.push(parsed.question);
      await user.save();
    }

    return NextResponse.json({
      question: parsed.question || "What is 2+2?",
      answer: parsed.answer || "4",
      user: {
        username: user.username,
        seenQuestions: user.seenQuestions.length,
      },
    });
  } catch (error) {
    console.error("Generate question error:", error);
    return NextResponse.json(
      { message: "Failed to generate question" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { authenticate } from "@/lib/auth";
import User from "@/models/User";
import connectDB from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticate(req);
    const { category, difficulty, count } = await req.json();

    const prompt = `Generate ${count} ${difficulty} difficulty ${category} quiz questions in JSON format:
[{"question":"...","options":["A","B","C","D"],"correctAnswer":"A","explanation":"..."}]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
    });

    const questions = JSON.parse(completion.choices[0]?.message?.content || "[]");
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Generate AI error:", error);
    return NextResponse.json({ message: "Failed to generate questions" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { authenticate } from "@/lib/auth";
import stringSimilarity from "string-similarity";
import connectDB from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticate(req);
    const { userAnswer, question, timeTaken } = await req.json();

    // Get AI evaluation
    const prompt = `Question: ${question}
User Answer: ${userAnswer}

Evaluate if the answer is correct. Respond ONLY in JSON:
{"isCorrect": true/false, "correctAnswer": "...", "feedback": "..."}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // ✅ Updated model
      temperature: 0.3,
    });

    const evaluation = JSON.parse(
      completion.choices[0]?.message?.content || "{}",
    );

    // Calculate similarity score
    const similarity = stringSimilarity.compareTwoStrings(
      userAnswer.toLowerCase(),
      evaluation.correctAnswer?.toLowerCase() || "",
    );

    // Calculate score
    let score = 0;
    if (evaluation.isCorrect) {
      score = timeTaken < 10 ? 10 : timeTaken < 20 ? 7 : 5;
    }

    // Update user stats
    await user.updateGameStats(score, evaluation.isCorrect);

    return NextResponse.json({
      result: {
        isCorrect: evaluation.isCorrect,
        correctAnswer: evaluation.correctAnswer,
        feedback: evaluation.feedback,
        similarity: Math.round(similarity * 100),
        score,
      },
      userStats: {
        totalScore: user.gameStats.totalScore,
        gamesPlayed: user.gameStats.gamesPlayed,
        accuracy: user.accuracy,
      },
    });
  } catch (error) {
    console.error("Evaluate answer error:", error);
    return NextResponse.json(
      { message: "Failed to evaluate answer" },
      { status: 500 },
    );
  }
}

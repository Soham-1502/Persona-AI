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

Evaluate if the answer is accurate. Award points based on conceptual correctness, even if the phrasing differs. 
Respond ONLY in JSON:
{"isCorrect": true/false, "explanation": "A brief explanation of why the answer is correct or what was missing.", "correctAnswer": "..."}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
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

    // Calculate score: Max 15 points, proportional to similarity if isCorrect is true
    // If AI says isCorrect but similarity is low (diverse phrasing), give at least a baseline score.
    let score = 0;
    if (evaluation.isCorrect) {
      // Base score 7 + up to 8 points for similarity
      score = Math.round(7 + (similarity * 8));
      // Cap at 15
      score = Math.min(score, 15);
    }

    // Update user stats
    await user.updateGameStats(score, evaluation.isCorrect);

    return NextResponse.json({
      result: {
        isCorrect: evaluation.isCorrect,
        correctAnswer: evaluation.correctAnswer,
        explanation: evaluation.explanation,
        feedback: evaluation.explanation, // Alias for backward compatibility if needed
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

import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import stringSimilarity from "string-similarity";
import connectDB from "@/lib/db";
import { runGroqAction } from "@/lib/ai-handler";

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticate(req);

    const { userAnswer, question, timeTaken } = await req.json();

    // Get AI evaluation using Multi-Key Chain
    const prompt = `Question: ${question}
User Answer: ${userAnswer}

Evaluate if the answer is accurate. Award points based on conceptual correctness, even if the phrasing differs. 
Be lenient: if the user got the core concept right but missed a word or had a typo, mark it as isCorrect: true.
Respond ONLY in JSON:
{"isCorrect": true/false, "explanation": "A brief explanation.", "correctAnswer": "..."}`;

    const completion = await runGroqAction((groq, model) =>
      groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: model,
        temperature: 0.3,
      })
    );

    const evaluation = JSON.parse(
      completion.choices[0]?.message?.content || "{}"
    );

    // Calculate similarity score
    const similarity = stringSimilarity.compareTwoStrings(
      userAnswer.toLowerCase(),
      evaluation.correctAnswer?.toLowerCase() || ""
    );

    // Hybrid Scoring:
    // 1. If AI says isCorrect: 7-15 points based on similarity
    // 2. If AI says incorrect but similarity is high (>0.5): 1-6 partial points
    // 3. Otherwise: 0 points
    let score = 0;
    if (evaluation.isCorrect) {
      score = Math.round(7 + (similarity * 8));
      score = Math.min(score, 15);
    } else if (similarity > 0.5) {
      // Partial credit for high similarity despite AI marking incorrect
      score = Math.round(similarity * 6);
      console.log(`💡 Partial points awarded based on similarity (${Math.round(similarity * 100)}%): ${score}`);
    }

    // Update user stats
    await user.updateGameStats(score, evaluation.isCorrect);

    console.log("-----------------------------------------");
    console.log(`📊 EVALUATION [Score: ${score}/15]:`);
    console.log(`❓ Q: ${question}`);
    console.log(`👤 User: ${userAnswer}`);
    console.log(`✅ Correct: ${evaluation.correctAnswer}`);
    console.log(`🎯 Similarity: ${Math.round(similarity * 100)}%`);
    console.log(`📢 Feedback: ${evaluation.explanation}`);
    console.log("-----------------------------------------");

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
      { message: "Failed to evaluate answer: " + error.message },
      { status: 500 }
    );
  }
}

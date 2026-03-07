import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import UserAttempt from "@/models/UserAttempt";
import ChatSession from "@/models/chatSession.model";
import { startOfDay, subDays, format } from "date-fns";

const GROQ_API_KEY = process.env.ai_insights;

export async function GET(request) {
    try {
        const user = await authenticate(request);
        const userId = user._id;

        // Fetch user data for the last 7 days to provide context to AI
        const last7Days = startOfDay(subDays(new Date(), 7));

        const [attempts, chatSessions] = await Promise.all([
            UserAttempt.find({ userId, timestamp: { $gte: last7Days } }).lean(),
            ChatSession.find({ userId, updatedAt: { $gte: last7Days } }).lean()
        ]);

        // Summarize data for AI
        const modules = {
            confidenceCoach: attempts.filter(a => a.moduleId === 'confidence-coach').length,
            inQuizzo: attempts.filter(a => a.moduleId === 'inQuizzo' || !a.moduleId).length,
            microLearning: attempts.filter(a => a.moduleId === 'microLearning').length,
            socialMentor: chatSessions.length
        };

        const totalAttempts = attempts.length + chatSessions.length;
        const accuracy = attempts.length > 0
            ? Math.round((attempts.filter(a => a.isCorrect).length / attempts.length) * 100)
            : 0;

        const topModule = Object.entries(modules).reduce((a, b) => b[1] > a[1] ? b : a)[0];
        const topModuleLabel = {
            confidenceCoach: "Confidence Coach",
            socialMentor: "Social Mentor",
            inQuizzo: "Quiz Prep",
            microLearning: "Micro-Learning"
        }[topModule] || "General Practice";

        // Construct AI Prompt
        const prompt = `
        You are PersonaAI, a supportive communication coach. Based on this user's activity from the last 7 days, generate professional, encouraging insights.
        
        USER ACTIVITY SUMMARY:
        - Total Practice Sessions: ${totalAttempts}
        - Accuracy Rate: ${accuracy}%
        - Module Activity: ${JSON.stringify(modules)}
        - Top Module: ${topModuleLabel}
        
        Return a JSON object with strictly these fields:
        1. "pattern": (string) A comprehensive narrative summary of their activity focus. DESCRIBE THEIR PROGRESS IN DETAIL. STRICTLY BETWEEN 100 AND 120 CHARACTERS.
        2. "snapshot": (array of strings) 2-3 short chips like "Top module • [Module]", "Consistency • High", etc.
        3. "suggestion": (string) A specific, personalized suggestion for improvement. STRICTLY BETWEEN 100 AND 120 CHARACTERS.
        4. "suggestionModule": (string|null) The name of a suggested module to try (e.g., "Social Mentor").
        5. "suggestionRoute": (string|null) The relative URL for that module (e.g., "/social-mentor").
        
        Ensure the tone is premium and professional. Max word limit for this is 120 words. The length of "pattern" and "suggestion" must be exactly within 100-120 characters.
        `;

        if (!GROQ_API_KEY) {
            console.error("Missing ai_insights API key");
            return NextResponse.json({ success: false, error: "AI configuration missing" }, { status: 500 });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const groqData = await response.json();
        const insights = JSON.parse(groqData.choices[0].message.content);

        return NextResponse.json({
            success: true,
            insights: {
                ...insights,
                streak: { current: user.gameStats?.streak || 0 } // Fallback to user model streak
            }
        });

    } catch (error) {
        console.error("AI Insights Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// app/api/mentor/route.js
import { authenticate } from "@/lib/auth";
import connectDB from "@/lib/db";
import UserAttempt from "@/models/UserAttempt";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { runGroqAction } from "@/lib/ai-handler";

// ── Auth helper ───────────────────────────────────────────────────────────────
function getUserFromToken(req) {
    try {
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "").trim();
        if (!token) return null;
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

export async function POST(req) {
    try {
        await connectDB();

        // Parse request body
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return Response.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // Convert messages to Groq format
        const groqMessages = [
            {
                role: "system",
                content: `You are a warm, supportive, and highly experienced Social Mentor. Your goal is to help users navigate tricky social situations with ease and confidence.

CRITICAL FORMATTING RULES:
- DO NOT use bullet points or asterisks (*). 
- DO NOT use excessive bolding.
- Write in natural, flowing paragraphs as if you are sending a thoughtful message to a friend.
- Use a warm, human, and encouraging tone. Avoid sounding like a structured AI assistant.

When a user presents a scenario:
1. Briefly acknowledge their situation with empathy.
2. Provide 3 distinct phrases they can use, woven naturally into your advice. Label them simply as "Option 1", "Option 2", etc., or just describe the vibe (e.g., "If you want to be more direct, try saying...").
3. For each phrase, explain in a sentence why it's effective.
4. End with one friendly, practical tip on their presence or delivery (like pacing or eye contact).

Make your entire response feel like a single, cohesive piece of advice from a real person who cares about their success.`
            },
            ...messages
                .filter(msg => msg.text && msg.text.trim())
                .map(msg => ({
                    role: msg.role === 'ai' ? 'assistant' : msg.role,
                    content: msg.text
                }))
        ];

        // Create streaming chat completion using Multi-Key Chain
        const chatCompletion = await runGroqAction((groq, model) =>
            groq.chat.completions.create({
                messages: groqMessages,
                model: model,
                temperature: 0.7,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: true,
                stop: null
            })
        );

        // Save session to DB (best-effort, non-blocking)
        const decoded = getUserFromToken(req);
        if (decoded?.userId && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            saveSessionAsync(decoded, lastMessage).catch((err) =>
                console.error("[mentor] Failed to save UserAttempt:", err)
            );
        }

        // Create streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of chatCompletion) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Stream error:', error);
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('API Error:', error);
        return Response.json(
            {
                error: error.message || 'Internal server error',
                details: error.toString()
            },
            { status: 500 }
        );
    }
}

// ── Async session saver (fire-and-forget) ─────────────────────────────────────
async function saveSessionAsync(decoded, lastMessage) {
    await connectDB();

    const user = await User.findById(decoded.userId).select("username mentorStats");
    if (!user) return;

    await UserAttempt.create({
        userId: user._id,
        username: user.username,
        moduleId: "socialMentor",
        sessionId: `mentor_${Date.now()}`,
        gameType: "chat",
        question: lastMessage.text,
        userAnswer: lastMessage.text,
        correctAnswer: "",
        isCorrect: true,
        score: 5,
        maxPossibleScore: 10,
        timeTaken: 0,
    });

    user.mentorStats.sessionsAttended += 1;
    user.mentorStats.lastSessionDate = new Date();
    await user.save();
}
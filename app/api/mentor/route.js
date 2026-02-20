// app/api/mentor/route.js
import { Groq } from 'groq-sdk';

// Initialize Groq client dynamically inside the function


export async function POST(req) {
    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

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

        // Create streaming chat completion
        const chatCompletion = await groq.chat.completions.create({
            messages: groqMessages,
            model: "llama-3.3-70b-versatile", // Llama 3.3 70B is excellent for conversational mentoring
            temperature: 0.7, // Slightly lowered for more focused and practical advice
            max_completion_tokens: 1024,
            top_p: 1,
            stream: true,
            stop: null
        });

        // Create streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Stream chunks - EXACT pattern from your code
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
import { NextResponse } from 'next/server';
import { withGroqFallback } from '@/lib/groq-keys';

export async function POST(req) {
    try {
        const body = await req.json();
        const { question, userTranscript, scenarioType, difficulty } = body;

        if (!question || !scenarioType) {
            return NextResponse.json({ success: false, error: 'question and scenarioType are required' }, { status: 400 });
        }

        const transcriptSection = userTranscript?.trim()
            ? `USER'S ACTUAL ANSWER:\n"${userTranscript.trim()}"\n`
            : `USER'S ACTUAL ANSWER: (no speech detected)\n`;

        const prompt = `
You are an elite communication coach specializing in "${scenarioType}" scenarios.

QUESTION ASKED:
"${question}"

${transcriptSection}

SCENARIO: ${scenarioType} | DIFFICULTY: ${difficulty || 'Beginner'}

Your task is to generate two things:

1. A concise IDEAL ANSWER (2-4 short paragraphs) — what a highly confident, well-prepared person would say in response to this "${scenarioType}" question. It should be:
   - Natural and conversational, not robotic
   - Well-structured: opening hook → key points → confident close
   - Tailored specifically to the "${scenarioType}" context
   - Appropriate for "${difficulty || 'Beginner'}" difficulty level

2. A SHORT ANNOTATION of the user's actual answer (1-2 sentences) — briefly note what they did well and what was missing. If no speech was detected, say so.

Return STRICT JSON in this format:
{
  "idealAnswer": "Full ideal answer text here...",
  "annotation": "Brief 1-2 sentence annotation of the user's actual answer..."
}
        `;

        const chatCompletion = await withGroqFallback((groqClient) =>
            groqClient.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' }
            })
        );

        const content = JSON.parse(chatCompletion.choices[0].message.content);

        return NextResponse.json({
            success: true,
            idealAnswer: content.idealAnswer || '',
            annotation: content.annotation || ''
        });

    } catch (error) {
        console.error('🛑 Fatal Error in ideal-answer route:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

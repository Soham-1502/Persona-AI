import { NextResponse } from 'next/server';
import { withGroqFallback } from '@/lib/groq-keys';

export async function POST(req) {
    try {
        console.log("🤖 Received feedback generation request");
        const body = await req.json();
        const { metrics, scenarioType, difficulty, question, userTranscript } = body;

        // Build optional content section
        const contentSection = question && userTranscript
            ? `
                    QUESTION ASKED:
                    "${question}"

                    USER'S SPOKEN ANSWER (transcript):
                    "${userTranscript.trim() || "(no speech detected)"}"

                    CONTENT RELEVANCE ANALYSIS:
                    - Did the user actually address the question? Were their points relevant to the "${scenarioType}" scenario?
                    - Did they stay focused or go off-topic?
                    - Was the answer structured (intro, key points, conclusion)?
                    - Were there any critical omissions for this scenario type?
                    Include at least ONE of your 3 improvement areas addressing the CONTENT of what they said, not just delivery.
            `
            : ``;

        const prompt = `
                    You are an elite communication and confidence coach. 
                    The user just completed a "${scenarioType}" practice session at "${difficulty}" difficulty.
                    
                    DELIVERY METRICS:
                    - Eye Contact: ${metrics.eyeContact}%
                    - Posture/Presence: ${metrics.posture}%
                    - Emotion: ${metrics.emotion}
                    - Pitch Stability: ${metrics.vocalStability}%
                    - Speaking Pace (WPM): ${metrics.wpm}
                    - Filler Words: ${metrics.fillers}
                    ${contentSection}
                    CRITICAL: The user has a deliberate speaking style.
                    WPM Thresholds: < 15 EXTREMELY SLOW, 20-65 IDEAL, > 80 TOO FAST.
                    Focus on substance, presence, AND content quality.

                    You MUST generate exactly 3 specific "Areas for Improvement". Be critical but constructive.
                    For each area, suggest a relevant training category from this list: 
                    - communication
                    - posture
                    - confidence
                    - charisma
                    - emotional-intelligence
                    - motivation
                    - resilience
                    - self-discipline
                    - leadership

                    Return your response in strict JSON format. 
                    The output must be a JSON object with a "feedback" key containing an array of exactly 3 objects:
                    {
                      "feedback": [
                        {
                          "title": "SHORT TITLE IN ALL CAPS",
                          "description": "Concise, actionable advice.",
                          "iconType": "one of: camera, mic, zap, activity, eye, trending",
                          "category": "matching category from the list above",
                          "searchQuery": "2-3 word search query to find a relevant training video (e.g., 'improve posture hacks', 'eye contact tips')"
                        }
                      ]
                    }
                `;

        const chatCompletion = await withGroqFallback((groqClient) =>
            groqClient.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' }
            })
        );

        const rawContent = chatCompletion.choices[0].message.content;
        const content = JSON.parse(rawContent);
        const feedback = content.feedback || [];

        console.log("✅ Feedback generated successfully!");
        return NextResponse.json({ success: true, feedback: feedback.slice(0, 3) });

    } catch (error) {
        console.error('🛑 Fatal Error in generate-feedback route:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

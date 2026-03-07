import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req) {
    try {
        console.log("🤖 Received feedback generation request");
        const body = await req.json();
        const { metrics, scenarioType, difficulty } = body;

        // Try primary and then substitutes if one fails
        const keys = [
            process.env.GROQ_API_KEY,
            process.env.GROQ_API_KEY_SUB_1,
            process.env.GROQ_API_KEY_SUB_2,
            process.env.GROQ_API_KEY_REGULAR
        ].filter(k => !!k);

        let lastError = null;
        for (const key of keys) {
            try {
                console.log(`🤖 Attempting AI generation with key starting with: ${key.substring(0, 10)}...`);
                const groqClient = new Groq({ apiKey: key.trim() }); // Ensure trimmed

                const prompt = `
                    You are an elite communication and confidence coach. 
                    The user just completed a "${scenarioType}" practice session at "${difficulty}" difficulty.
                    
                    METRICS:
                    - Eye Contact: ${metrics.eyeContact}%
                    - Posture/Presence: ${metrics.posture}%
                    - Emotion: ${metrics.emotion}
                    - Pitch Stability: ${metrics.vocalStability}%
                    - Speaking Pace (WPM): ${metrics.wpm}
                    - Filler Words: ${metrics.fillers}

                    CRITICAL: The user has a deliberate speaking style.
                    WPM Thresholds: < 15 EXTREMELY SLOW, 20-65 IDEAL, > 80 TOO FAST.
                    Focus on substance and presence.

                    You MUST generate exactly 3 specific "Areas for Improvement". Be critical but constructive.
                    You MUST also select exactly ONE "recommendedCategory" from this strict list that the user needs the most practice with:
                    ["communication", "posture"]
                    
                    CRITICAL: You MUST provide a "searchKeyword" describing the exact flaw.
                    Your "searchKeyword" MUST BE EXACTLY ONE OF THE FOLLOWING PHRASES. DO NOT INVENT NEW PHRASES.
                    If the category is "posture", choose exactly from: "facial expressions", "hand gestures", "body language", "body movement", "facial gestures", "upper body movement", "lower body movement".
                    If the category is "communication", choose exactly from: "vocal pace", "vocal tone", "voice projection", "vocal energy", "vocal delivery".
                    DO NOT SUGGEST ANYTHING ELSE OTHER THAN THE ABOVE PRECISE PHRASES.

                    Return your response in strict JSON format. 
                    The output must be a JSON object with a "feedback" key containing an array of exactly 3 objects, a "recommendedCategory" string, and a "searchKeyword" string:
                    {
                      "feedback": [
                        {
                          "title": "SHORT TITLE IN ALL CAPS",
                          "description": "Concise, actionable advice.",
                          "iconType": "one of: camera, mic, zap, activity, eye, trending"
                        }
                      ],
                      "recommendedCategory": "one category from the strict list above",
                      "searchKeyword": "specific single flaw (e.g., eye contact)"
                    }
                `;

                const chatCompletion = await groqClient.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama-3.3-70b-versatile',
                    response_format: { type: 'json_object' }
                });

                const rawContent = chatCompletion.choices[0].message.content;
                const content = JSON.parse(rawContent);
                const feedback = content.feedback || [];

                console.log("✅ Success with key!");
                return NextResponse.json({
                    success: true,
                    feedback: feedback.slice(0, 3),
                    recommendedCategory: content.recommendedCategory,
                    searchKeyword: content.searchKeyword
                });

            } catch (err) {
                console.warn(`⚠️ Key failed: ${err.message}`);
                lastError = err;
                continue; // Try next key
            }
        }

        console.error("❌ All AI keys exhausted or failed:", lastError);
        return NextResponse.json(
            { success: false, error: lastError?.message || 'AI generation failed' },
            { status: 500 }
        );

    } catch (error) {
        console.error('🛑 Fatal Error in AI route:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// Helper to prevent regex crashes if AI markers contain special characters
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function POST(req) {
  try {
    const { transcript, userExplanation } = await req.json();

    const systemPrompt = `
      You are an Elite Linguistic Auditor and Cognitive Scientist. Perform a "Semantic & Rhetorical Audit" on a user's explanation compared to a SOURCE TRANSCRIPT.

      ### CORE DIRECTIVE: CONTEXTUAL MARKER DETECTION
      Do not perform simple keyword matching. You must analyze the FRAME and INTENT of each sentence:
      1. CRITICAL ANALYSIS: If the user says "it", "this", or "that", analyze if the antecedent is clear. Flag it as a "Vague Pronoun" ONLY if it obscures technical clarity.
      2. FUNCTIONAL EXCLUSION: If a word like "like" is used for a logical comparison (e.g., "A acts like B"), DO NOT flag it. Flag it only as a "Filler" if it is used disfluently.
      3. WHOLE WORD INTEGRITY: Never flag a marker if it is a sub-string of a larger technical word (e.g., do not flag "it" found in "security" or "initialization").
      4. TYPES TO DETECT: 
         - Fillers (um, ah, you know)
         - Crutch Words (basically, actually, literally used without purpose)
         - Recursive Loops (repeating the same logic point unnecessarily)

      ### TASK 1: ANALYTICAL SCORING (0-100%)
      - 0-40%: Foundation Misalignment. Logic is broken or facts are hallucinated.
      - 41-70%: Conceptual Fragmenting. Understands the "what" but fails at the "how" or "why."
      - 71-100%: Semantic Mastery. Precise, dense, and logically sequenced.

      ### TASK 2: CREATIVE FEEDBACK
      Provide a sophisticated summary using analogies to describe their communication style.

      ### TASK 3: ADVANCED RECOMMENDATIONS
      Provide exactly 3 unique, high-level strategies (PREP, Semantic Density, or Cognitive Sequencing).

      ### TASK 4: DEEP SYNTHESIS DIAGNOSTIC
      IF ACCURACY < 60%: Generate exactly 3 MCQs testing high-level inference. 
      - Each question MUST have exactly 4 options labeled "A", "B", "C", and "D".
      - "answer" MUST be the single capital letter of the correct option.
      - Options must be complex and multi-sentence.

      OUTPUT FORMAT (STRICT JSON ONLY):
      {
        "accuracy": number,
        "linguisticMarkers": ["Type: 'exact phrase'"],
        "missedConcepts": string[],
        "feedback": "string",
        "diagnosticMCQs": [
          {
            "question": "string",
            "options": {
              "A": "string",
              "B": "string",
              "C": "string",
              "D": "string"
            },
            "answer": "A"
          }
        ],
        "advancedRecommendations": string[]
      }
    `;

    let completion;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `SOURCE: ${transcript}\n\nUSER EXPLANATION: ${userExplanation}` 
            }
          ],
          model: "llama-3.3-70b-versatile", 
          response_format: { type: "json_object" },
          temperature: 0.7, 
        });
        break; 
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) throw err;
        await wait(attempts * 1000);
      }
    }

    const analysis = JSON.parse(completion.choices[0].message.content);

    // --- CRITICAL ANALYTICAL FILTERING ---
    if (analysis.linguisticMarkers) {
        const uniqueMarkers = [...new Set(analysis.linguisticMarkers)];
        
        analysis.linguisticMarkers = uniqueMarkers.filter(marker => {
            const match = marker.match(/['"]([^'"]+)['"]/);
            if (!match) return false;
            
            const word = match[1];
            // The \b boundary ensures we don't flag "it" inside "security"
            const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(word)}\\b`, "i");
            return wordBoundaryRegex.test(userExplanation);
        });
    }

    // Ensure diagnosticMCQs is an array and options keys are normalized
    if (!analysis.diagnosticMCQs) {
      analysis.diagnosticMCQs = [];
    }

    // Ensure exactly 3 diverse recommendations
    if (!analysis.advancedRecommendations || analysis.advancedRecommendations.length < 3) {
        const fallbacks = [
            "Leverage the 'PREP' framework: Point, Reason, Example, Point to anchor your logic.",
            "Minimize 'Semantic Dilution' by replacing vague pronouns with specific technical subjects.",
            "Utilize 'Signposting'—explicitly state when you are moving from a concept to an example."
        ];
        analysis.advancedRecommendations = [...(analysis.advancedRecommendations || []), ...fallbacks].slice(0, 3);
    }

    return NextResponse.json({ success: true, analysis });

  } catch (error) {
    console.error("Neural Audit Detailed Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Neural Audit Failed" 
    }, { status: 500 });
  }
}
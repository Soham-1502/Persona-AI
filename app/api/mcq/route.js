import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// This Map stores the quiz so the next page can find it
const quizCache = new Map();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');
  if (videoId && quizCache.has(videoId)) {
    return NextResponse.json({ success: true, mcqs: quizCache.get(videoId) });
  }
  return NextResponse.json({ success: false });
}

export async function POST(req) {
  try {
    const { segments, videoId } = await req.json();

    // 1. Ensure segments exist and extract text properly
    if (!segments || !Array.isArray(segments)) {
      return NextResponse.json({ success: false, error: "No segments provided" }, { status: 400 });
    }

    // Map segments safely and trim to stay within context limits
    const knowledgeSource = segments
      .map(s => (typeof s === 'string' ? s : s.text))
      .join("\n\n")
      .substring(0, 30000); 

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are an Elite Assessment Designer. Generate exactly 8 high-level MCQs.
          Your response MUST be a JSON object with a key named "mcqs" containing an array of objects.
          Each object must have: "question", "options" (array of 4), "answer" (string), and "explanation".` 
        },
        { role: "user", content: knowledgeSource }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      response_format: { type: "json_object" },
    });

    const content = JSON.parse(completion.choices[0].message.content);
    
    // 2. Validate the JSON structure before caching
    const mcqs = content.mcqs || content.questions || [];

    if (mcqs.length === 0) {
      throw new Error("AI failed to generate MCQs in the expected format");
    }

    // SAVE TO MEMORY
    if (videoId) {
      quizCache.set(videoId, mcqs);
      console.log(`✅ MCQs cached for: ${videoId}`);
    }

    return NextResponse.json({ success: true, mcqs: mcqs });
  } catch (error) {
    console.error("MCQ Generation Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}
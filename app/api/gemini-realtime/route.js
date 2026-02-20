import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const body = await request.json();
    const { videoId, timestamp, userQuestion, videoInfo } = body;

    console.log("API request received:", { videoId, timestamp, userQuestion: userQuestion?.slice(0, 100) });

    if (!videoId || !timestamp) {
      return new Response(JSON.stringify({ error: "Missing videoId or timestamp" }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in environment");
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ]
    });

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const prompt = `
Video title: ${videoInfo?.title || 'Unknown title'}
Video description: ${videoInfo?.description || 'No description'}

Video URL: ${videoUrl}
Current timestamp: ${timestamp}

User question: ${userQuestion || 'Describe what is happening right now.'}

Answer concisely and directly. If you can't access the video, say "Video content not accessible" and stop.
`;

    console.log("Sending prompt to Gemini:", prompt.slice(0, 300) + "...");

    const result = await model.generateContent(prompt);
    const responseText = result.response?.text?.() || '';

    console.log("Gemini full response:", result);
    console.log("Gemini extracted text:", responseText);

    return new Response(
      JSON.stringify({ 
        insight: responseText || "Gemini returned empty. Video may be private or prompt blocked." 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Gemini API error:", error.message, error.stack);
    return new Response(
      JSON.stringify({ insight: "Error: Could not get response from Gemini." }),
      { status: 200 }
    );
  }
}
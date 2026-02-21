import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ message: "Text is required" }, { status: 400 });
        }

        // Unofficial Microsoft Edge TTS endpoint (for free neural voices)
        const voice = "en-US-JennyNeural"; // High quality natural voice
        const url = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/single-step?api-key=6A5AA1D4EAFF4E9FB37E23D1A48D9886`;

        // Construct the synthesis request body (this is a common way to consume this internal API)
        const body = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody rate='0%' pitch='0%'>${text}</prosody></voice></speak>`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.41",
            },
            body: body,
        });

        if (!response.ok) {
            throw new Error(`TTS service error: ${response.statusText}`);
        }

        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });
    } catch (error) {
        console.error("❌ TTS Proxy error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

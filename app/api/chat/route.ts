import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a highly empathetic and knowledgeable Social Mentor AI. Your goal is to help users improve their social skills, confidence, and communication. You should provide constructive feedback, roleplay scenarios (responding as a specific persona if asked), and offer practical tips. Keep responses concise and conversational (under 3 sentences usually) unless a detailed explanation is requested. Maintain a supportive and encouraging tone.",
});

export async function POST(req: Request) {
    try {
        // 1. Check Key
        if (!apiKey) {
            throw new Error("Missing API Key");
        }

        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // 2. Real AI Request
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({ history: history });
        const result = await chat.sendMessage(lastMessage.text);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });

    } catch (error) {
        console.error("Gemini API Failed, switching to Mock:", error);

        // 3. Fallback Mock Logic (Offline Mode)
        // This ensures the demo ALWAYS works, even without internet or keys.
        const body = await req.json().catch(() => ({ messages: [] }));
        const lastText = (body.messages?.length > 0)
            ? body.messages[body.messages.length - 1].text.toLowerCase()
            : "";

        let mockResponse = "I'm having a little trouble connecting to the cloud, but I'm here. Could you tell me more about that?";

        if (lastText.includes("rude") || lastText.includes("mean") || lastText.includes("hurt")) {
            mockResponse = "It's tough when people are dismissive. Try taking a deep breath and saying: 'I feel uncomfortable when you speak to me like that.'";
        } else if (lastText.includes("nervous") || lastText.includes("scared")) {
            mockResponse = "It's completely normal to feel nervous. Try grounding yourself by focusing on your breathing for a moment.";
        } else if (lastText.includes("hello") || lastText.includes("hi") || lastText.includes("hey")) {
            mockResponse = "Hello there! I'm your Social Mentor. I can help you practice difficult conversations. What's on your mind?";
        } else if (lastText.length > 0) {
            mockResponse = "That's an interesting point. Let's practice maintaining confident body language while you explain that further.";
        }

        return NextResponse.json({ text: mockResponse });
    }
}

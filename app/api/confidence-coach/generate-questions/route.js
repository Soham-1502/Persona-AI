import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
    try {
        const body = await req.json();
        const { scenarioType } = body;

        if (!scenarioType) {
            return NextResponse.json({ success: false, error: 'scenarioType is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Generate exactly one realistic practice question for a "${scenarioType}" scenario, to be spoken aloud by the user. Return ONLY the plain text string of the question. No markdown, no prefixes, no quotation marks.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        return NextResponse.json({ success: true, question: text });
    } catch (error) {
        console.error('Error generating AI question:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error while generating question.' },
            { status: 500 }
        );
    }
}

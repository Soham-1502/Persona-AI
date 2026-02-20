// app/api/mentor/history/route.js
import connectDB from '@/backend/config/db';
import ChatSession from '@/backend/models/chatSession.model';
import { NextResponse } from 'next/server';

// Get all chat history sessions
export async function GET() {
    try {
        await connectDB();

        // Fetch all sessions and sort by recent
        const sessions = await ChatSession.find({}).sort({ updatedAt: -1 });
        console.log(`Found ${sessions.length} sessions in DB`);

        return NextResponse.json({ success: true, data: sessions }, { status: 200 });
    } catch (error) {
        console.error('History GET Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch history' },
            { status: 500 }
        );
    }
}

// Create or update a session
export async function POST(req) {
    try {
        await connectDB();

        const { sessionId, messages, title } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400 });
        }

        // Logic to build a dynamic title if one isn't provided (usually from the first user message)
        let generatedTitle = title;
        if (!generatedTitle && messages && messages.length > 1) {
            // Find the first message from the user
            const firstUserMsg = messages.find(m => m.role === 'user');
            if (firstUserMsg && firstUserMsg.text) {
                // Slice the first few words for the title
                generatedTitle = firstUserMsg.text.split(' ').slice(0, 5).join(' ') + '...';
            }
        }

        if (!generatedTitle) {
            generatedTitle = 'New Conversation';
        }

        // Upsert the chat session
        const session = await ChatSession.findOneAndUpdate(
            { sessionId },
            {
                $set: {
                    title: generatedTitle,
                    messages: messages,
                    updatedAt: Date.now()
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: session }, { status: 200 });

    } catch (error) {
        console.error('History POST Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update history' },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { ConfidenceCoachSession } from "@/models/ConfidenceCoachSession";

export async function POST(req) {
    try {
        await connectDB();
        console.log("🚀 Session POST request received");

        let decodedUser;
        try {
            decodedUser = await authenticate(req);
            console.log("✅ User authenticated:", decodedUser?.email);
        } catch (authError) {
            console.error("❌ Authentication failed:", authError.message);
            return NextResponse.json(
                { success: false, error: "Unauthorized: " + authError.message },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { score, timeTaken, sessionId, question, userAnswer, metrics, meta } = body;
        console.log("📦 Request body:", { score, timeTaken, sessionId });

        if (score === undefined || score === null || timeTaken === undefined || timeTaken === null) {
            return NextResponse.json(
                { success: false, error: "Missing required session parameters (score, timeTaken)" },
                { status: 400 }
            );
        }

        console.log("🔌 Database already connected");

        // Use findOne to get the full user document with all properties
        const user = await User.findById(decodedUser._id);

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found in database" },
                { status: 404 }
            );
        }

        // Initialize stats block if missing
        if (!user.confidenceCoachStats) {
            console.log("🆕 Initializing confidenceCoachStats for user");
            user.confidenceCoachStats = {
                sessionsCompleted: 0,
                voiceTrainingMinutes: 0,
                lastSessionDate: null,
                averageScore: 0
            };
        }

        const stats = user.confidenceCoachStats;
        const oldAvg = stats.averageScore || 0;
        const oldCount = stats.sessionsCompleted || 0;

        let newAvg = ((oldAvg * oldCount) + score) / (oldCount + 1);
        newAvg = Math.round(newAvg * 10) / 10;

        // Manually update the document fields
        user.confidenceCoachStats.averageScore = newAvg;
        user.confidenceCoachStats.sessionsCompleted = oldCount + 1;
        user.confidenceCoachStats.voiceTrainingMinutes += (timeTaken / 60);
        user.confidenceCoachStats.lastSessionDate = new Date();

        console.log("💾 Saving user stats...");
        // Use try-catch specifically for save to capture validation errors
        try {
            await user.save();
            
            // Save the detailed session
            if (sessionId && question && userAnswer) {
                await ConfidenceCoachSession.create({
                    userId: user._id,
                    sessionId: sessionId,
                    question: question,
                    userAnswer: userAnswer,
                    score: score,
                    timeTaken: timeTaken,
                    metrics: metrics || {},
                    meta: meta || {}
                });
                console.log("✅ Detailed session record stored");
            }
            
            console.log("✅ Session stats updated successfully");
        } catch (saveError) {
            console.error("❌ Mongoose Save Error:", saveError);
            throw new Error("Failed to save user data: " + saveError.message);
        }

        return NextResponse.json({
            success: true,
            stats: user.confidenceCoachStats
        });

    } catch (error) {
        console.error("❌ Confidence Coach Session Persistence Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error: " + error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        await connectDB();
        let decodedUser;
        try {
            decodedUser = await authenticate(req);
        } catch (authError) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const sessionId = url.searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 });
        }

        const session = await ConfidenceCoachSession.findOne({ 
            userId: decodedUser._id, 
            sessionId: sessionId 
        }).lean();

        if (!session) {
            return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, session });

    } catch (error) {
        console.error("❌ Confidence Coach Session Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}

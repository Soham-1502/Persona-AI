import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { score, timeTaken } = body;

        if (score === undefined || score === null || timeTaken === undefined || timeTaken === null) {
            return NextResponse.json(
                { success: false, error: "Missing required session parameters (score, timeTaken)" },
                { status: 400 }
            );
        }

        await connectDB();

        // 1. Fetch User Record
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // 2. Initialize stats block if missing
        if (!user.confidenceCoachStats) {
            user.confidenceCoachStats = {
                sessionsCompleted: 0,
                voiceTrainingMinutes: 0,
                lastSessionDate: null,
                averageScore: 0
            };
        }

        const stats = user.confidenceCoachStats;

        // 3. Rolling Average calculation 
        // new avg = ((old avg * old count) + new score) / (old count + 1)
        const oldAvg = stats.averageScore || 0;
        const oldCount = stats.sessionsCompleted || 0;

        let newAvg = ((oldAvg * oldCount) + score) / (oldCount + 1);
        newAvg = Math.round(newAvg * 10) / 10; // round to 1 decimal point

        // 4. Update MongoDB Document
        stats.averageScore = newAvg;
        stats.sessionsCompleted = oldCount + 1;
        stats.voiceTrainingMinutes += (timeTaken / 60); // Math expects total minutes floated
        stats.lastSessionDate = new Date();

        await user.save();

        return NextResponse.json({
            success: true,
            stats: user.confidenceCoachStats
        });

    } catch (error) {
        console.error("Confidence Coach Session Persistence Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

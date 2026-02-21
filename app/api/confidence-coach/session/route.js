import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { authenticate } from '@/lib/auth';
import UserAttempt from '@/models/UserAttempt';

export async function POST(req) {
    try {
        await connectDB();

        // Authenticate the user
        const user = await authenticate(req);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Parse payload
        const body = await req.json();
        const {
            moduleId,
            gameType,
            sessionId,
            question,
            userAnswer,
            correctAnswer,
            isCorrect,
            score,
            timeTaken
        } = body;

        // Create the individual attempt record
        const attempt = await UserAttempt.create({
            moduleId: moduleId || 'confidenceCoach',
            userId: user._id,
            username: user.username,
            sessionId: sessionId || crypto.randomUUID(),
            gameType: gameType || 'voice',
            question: question || 'General Practice',
            userAnswer: userAnswer || '(No transcript)',
            correctAnswer: correctAnswer || 'completed',
            isCorrect: isCorrect !== undefined ? isCorrect : true,
            score: Number(score) || 0,
            maxPossibleScore: 10,
            timeTaken: Number(timeTaken) || 0,
            timestamp: new Date()
        });

        // Update the User's aggregate statistics safely
        const stats = user.confidenceCoachStats || {
            sessionsCompleted: 0,
            voiceTrainingMinutes: 0,
            averageScore: 0,
            lastSessionDate: null
        };

        const newSessionsCompleted = (stats.sessionsCompleted || 0) + 1;
        const previousTotalMins = stats.voiceTrainingMinutes || 0;
        const newVoiceMins = previousTotalMins + (Number(timeTaken) / 60);

        // Calculate moving average for score
        const currentAvg = stats.averageScore || 0;
        const newScore = Number(score) || 0;
        const newAvgScore = ((currentAvg * (newSessionsCompleted - 1)) + newScore) / newSessionsCompleted;

        user.confidenceCoachStats = {
            sessionsCompleted: newSessionsCompleted,
            voiceTrainingMinutes: newVoiceMins,
            averageScore: newAvgScore,
            lastSessionDate: new Date()
        };

        await user.save();

        return NextResponse.json({
            success: true,
            sessionSaved: true,
            attemptId: attempt._id
        });

    } catch (error) {
        console.error('Error saving confidence coach session:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

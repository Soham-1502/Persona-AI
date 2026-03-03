// app/api/dashboard/live-data/route.js
// Unified endpoint: returns real UserAttempt records (all modules) shaped
// like dashboard sessions, plus InQuizzo module-progress stats.

import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import connectDB from '@/lib/db';
import UserAttempt from '@/models/UserAttempt';
import mongoose from 'mongoose';

// ─── helpers ──────────────────────────────────────────────────────────────────

function toLocalDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Convert attempt records into a single dashboard session item per sessionId.
 * This keeps dashboard metrics aligned with InQuizzo page cards, which are
 * session-aware for totals and accuracy calculations.
 */
function normalizeModuleId(moduleId) {
    const allowed = new Set(['inQuizzo', 'confidenceCoach', 'socialMentor', 'microLearning']);
    if (allowed.has(moduleId)) return moduleId;
    return 'inQuizzo';
}

function attemptsToSessions(attempts) {
    const sessionsById = new Map();

    for (const attempt of attempts) {
        const module = normalizeModuleId(attempt.moduleId);
        const sessionBaseId = attempt.sessionId || attempt._id.toString();
        const sessionId = `${module}:${sessionBaseId}`;
        const timestamp = new Date(attempt.timestamp);

        if (!sessionsById.has(sessionId)) {
            sessionsById.set(sessionId, {
                _id: sessionId,
                date: toLocalDateStr(timestamp),
                module,
                isVoiceQuiz: false,
                duration: 0,
                attemptCount: 0,
                correctCount: 0,
            });
        }

        const session = sessionsById.get(sessionId);
        session.isVoiceQuiz = session.isVoiceQuiz || attempt.gameType === 'voice';
        session.duration += attempt.timeTaken ?? 30;
        session.attemptCount += 1;
        session.correctCount += attempt.isCorrect ? 1 : 0;
    }

    return [...sessionsById.values()].map((session) => {
        const accuracy = session.attemptCount > 0
            ? Math.round((session.correctCount / session.attemptCount) * 100)
            : 0;

        return {
            _id: session._id,
            date: session.date,
            module: session.module,
            isVoiceQuiz: session.isVoiceQuiz,
            duration: session.duration,
            confidenceDelta: Math.max(1, Math.round(accuracy / 20)),
        };
    });
}

function aggregateRangeStats(attempts, moduleId = null) {
    const sessionsById = new Map();

    for (const attempt of attempts) {
        const module = normalizeModuleId(attempt.moduleId);
        if (moduleId && module !== moduleId) continue;

        const sessionBaseId = attempt.sessionId || attempt._id.toString();
        const sessionId = `${module}:${sessionBaseId}`;

        if (!sessionsById.has(sessionId)) {
            sessionsById.set(sessionId, { count: 0, correct: 0 });
        }

        const session = sessionsById.get(sessionId);
        session.count += 1;
        session.correct += attempt.isCorrect ? 1 : 0;
    }

    let totalQuestions = 0;
    let totalCorrect = 0;

    for (const session of sessionsById.values()) {
        totalQuestions += session.count;
        totalCorrect += session.correct;
    }

    const totalSessions = sessionsById.size;
    const accuracyRate = totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;

    return { totalQuestions, totalCorrect, totalSessions, accuracyRate };
}

// ─── route ────────────────────────────────────────────────────────────────────

export async function GET(req) {
    try {
        await connectDB();
        const user = await authenticate(req);

        if (!user) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        // --- Parse range ---
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || 'last7';

        const now = new Date();

        function buildDateFilter(start) {
            return { timestamp: { $gte: start } };
        }

        function buildPrevDateFilter(start, end) {
            return { timestamp: { $gte: start, $lte: end } };
        }

        let currentStart, prevStart, prevEnd;

        if (range === 'today') {
            currentStart = new Date(now); currentStart.setHours(0, 0, 0, 0);
            prevStart = new Date(currentStart); prevStart.setDate(prevStart.getDate() - 1);
            prevEnd = new Date(currentStart); prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
        } else if (range === 'last7') {
            currentStart = new Date(now); currentStart.setDate(now.getDate() - 6); currentStart.setHours(0, 0, 0, 0);
            prevStart = new Date(currentStart); prevStart.setDate(prevStart.getDate() - 7);
            prevEnd = new Date(currentStart); prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
        } else { // last30
            currentStart = new Date(now); currentStart.setDate(now.getDate() - 29); currentStart.setHours(0, 0, 0, 0);
            prevStart = new Date(currentStart); prevStart.setDate(prevStart.getDate() - 30);
            prevEnd = new Date(currentStart); prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
        }

        const baseFilter = { userId };

        // --- Fetch current & previous periods in parallel ---
        const [currentAttempts, previousAttempts] = await Promise.all([
            UserAttempt.find({ ...baseFilter, ...buildDateFilter(currentStart) })
                .sort({ timestamp: -1 })
                .lean(),

            UserAttempt.find({ ...baseFilter, ...buildPrevDateFilter(prevStart, prevEnd) })
                .sort({ timestamp: -1 })
                .lean(),
        ]);

        // --- Shape sessions ---
        const currentSessions = attemptsToSessions(currentAttempts);
        const previousSessions = attemptsToSessions(previousAttempts);

        // --- Module progress stats (range-aligned with InQuizzo cards) ---
        const agg = aggregateRangeStats(currentAttempts, "inQuizzo");

        const accuracyProgress = agg.accuracyRate;
        const questionsProgress = Math.min(100, agg.totalQuestions);
        const sessionsProgress = Math.min(100, Math.round((agg.totalSessions / 20) * 100));

        return NextResponse.json({
            currentSessions,
            previousSessions,
            moduleProgress: {
                accuracyProgress,
                questionsProgress,
                sessionsProgress,
                totalQuestions: agg.totalQuestions,
                totalCorrect: agg.totalCorrect,
                totalSessions: agg.totalSessions,
            },
        });

    } catch (error) {
        console.error('live-data error:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to fetch live data' },
            { status: error.message === 'No token provided' ? 401 : 500 }
        );
    }
}

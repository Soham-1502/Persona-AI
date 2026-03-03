// app/api/dashboard/live-data/route.js
// Unified endpoint: returns real InQuizzo UserAttempt records shaped like
// mockSessions, plus all-time module-progress stats and streak.

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

/** Convert a raw UserAttempt document into the session shape dashboard expects */
function attemptToSession(attempt) {
    return {
        _id: attempt._id.toString(),
        date: toLocalDateStr(new Date(attempt.timestamp)),
        module: 'inQuizzo',            // ActivityChart groups on this key
        isVoiceQuiz: attempt.gameType === 'voice',
        confidenceDelta: attempt.isCorrect ? 2 : 1,
        duration: attempt.timeTaken ?? 30,
    };
}

/**
 * Compute the current consecutive-day streak from an array of unique date strings
 * (e.g. ['2026-03-03', '2026-03-02', ...]) sorted descending.
 */
function computeStreak(uniqueDatesSortedDesc) {
    if (!uniqueDatesSortedDesc.length) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let cursor = new Date(today);

    for (const dateStr of uniqueDatesSortedDesc) {
        const d = new Date(dateStr);
        d.setHours(0, 0, 0, 0);

        if (d.getTime() === cursor.getTime()) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
        } else if (d.getTime() > cursor.getTime()) {
            continue; // skip future dates
        } else {
            break; // gap found
        }
    }
    return streak;
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

        const baseFilter = { userId, moduleId: 'inQuizzo' };

        // --- Fetch all queries in parallel ---
        const [currentAttempts, previousAttempts, allTimeAgg, allTimeDates] = await Promise.all([
            // Current period attempts
            UserAttempt.find({ ...baseFilter, ...buildDateFilter(currentStart) })
                .sort({ timestamp: -1 })
                .lean(),

            // Previous period attempts (for badges)
            UserAttempt.find({ ...baseFilter, ...buildPrevDateFilter(prevStart, prevEnd) })
                .sort({ timestamp: -1 })
                .lean(),

            // All-time aggregation for module progress section
            UserAttempt.aggregate([
                { $match: baseFilter },
                {
                    $group: {
                        _id: '$sessionId',
                        sessionCorrect: { $sum: { $cond: ['$isCorrect', 1, 0] } },
                        sessionCount: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalQuestions: { $sum: '$sessionCount' },
                        totalCorrect: { $sum: '$sessionCorrect' },
                        totalSessions: { $sum: 1 },
                    },
                },
            ]),

            // All-time unique session dates for streak calculation
            UserAttempt.aggregate([
                { $match: baseFilter },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$timestamp',
                                timezone: 'Asia/Kolkata',
                            }
                        }
                    }
                },
                { $sort: { _id: -1 } },
            ]),
        ]);

        // --- Shape sessions ---
        const currentSessions = currentAttempts.map(attemptToSession);
        const previousSessions = previousAttempts.map(attemptToSession);

        // --- Unique Session Counting (Group by sessionId) ---
        const currentUniqueSessionIds = new Set(currentAttempts.map(a => a.sessionId).filter(Boolean));
        const previousUniqueSessionIds = new Set(previousAttempts.map(a => a.sessionId).filter(Boolean));

        const totalSessions = currentUniqueSessionIds.size;
        const prevTotalSessions = previousUniqueSessionIds.size;

        // --- Voice quiz counts (current & previous period) ---
        const voiceQuizCount = currentAttempts.filter(a => a.gameType === 'voice').length;
        const prevVoiceQuizCount = previousAttempts.filter(a => a.gameType === 'voice').length;

        // --- Streak ---
        const uniqueDates = allTimeDates.map(d => d._id).filter(Boolean);
        const currentStreak = computeStreak(uniqueDates);

        // --- Confidence score ---
        // Base 70 + sum of confidenceDeltas in current period sessions
        const BASE_SCORE = 70;
        const confidenceScore = Math.min(
            100,
            BASE_SCORE + currentSessions.reduce((sum, s) => sum + (s.confidenceDelta || 0), 0)
        );

        // --- Previous confidence score (for badge delta) ---
        const prevConfidenceScore = Math.min(
            100,
            BASE_SCORE + previousSessions.reduce((sum, s) => sum + (s.confidenceDelta || 0), 0)
        );

        // --- Module progress stats ---
        const agg = allTimeAgg[0] ?? { totalQuestions: 0, totalCorrect: 0, totalSessions: 0 };

        const accuracyProgress = agg.totalQuestions > 0
            ? Math.round((agg.totalCorrect / agg.totalQuestions) * 100)
            : 0;
        const questionsProgress = Math.min(100, Math.round((agg.totalQuestions / 200) * 100));
        const sessionsProgress = Math.min(100, Math.round((agg.totalSessions / 20) * 100));

        return NextResponse.json({
            currentSessions,
            previousSessions,
            voiceQuizCount,
            prevVoiceQuizCount,
            currentStreak,
            confidenceScore,
            prevConfidenceScore,
            totalSessions,
            prevTotalSessions,
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

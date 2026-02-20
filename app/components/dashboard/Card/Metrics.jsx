// Total Sessions Metric Card

export function getTotalSessions(sessions) {
    // Adding ?.length and || 0 ensures this never returns 'undefined'
    return sessions?.length || 0;
}

// Metrics.jsx

export function getTotalSessionsBadge(current, previous) {
    // If no data exists in the previous period, show a flat increase count
    if (previous === 0) {
        return {
            text: `+${current} sessions`,
            tone: "positive"
        };
    }

    // Standard percentage improvement calculation
    const change = Math.round(((current - previous) / previous) * 100);

    return {
        text: `${change >= 0 ? "+" : ""}${change}%`,
        tone: change >= 0 ? "positive" : "negative"
    };
}
// Confidence Score Metric Card

export function getConfidenceScore(sessions) {
    const BASE_SCORE = 70;
    if (!sessions || !Array.isArray(sessions)) return BASE_SCORE;

    const deltaSum = sessions.reduce(
        (sum, session) => sum + (session.confidenceDelta || 0),
        0
    );

    return Math.min(100, BASE_SCORE + deltaSum);
}

// Metrics.jsx

export function getConfidenceScoreBadge(currentSessions, previousSessions) {
    const currentGain = currentSessions?.reduce((sum, s) => sum + (s.confidenceDelta || 0), 0) || 0;
    const previousGain = previousSessions?.reduce((sum, s) => sum + (s.confidenceDelta || 0), 0) || 0;

    const delta = currentGain - previousGain;
    return {
        text: `${delta >= 0 ? "+" : "-"}${Math.abs(delta)}%`,
        tone: delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral",
    };
}

// Voice Quizzes Metric Card

export function getVoiceQuizzes(sessions) {
    return sessions.filter((session) => session.isVoiceQuiz).length;
}

export function getVoiceQuizzesBadge(currentSessions, previousSessions, range) {
    // Safety check: default to 0 if inputs are invalid or not arrays
    const currentCount = Array.isArray(currentSessions)
        ? currentSessions.filter(s => s.isVoiceQuiz).length
        : 0;

    const previousCount = Array.isArray(previousSessions)
        ? previousSessions.filter(s => s.isVoiceQuiz).length
        : 0;

    const diff = currentCount - previousCount;
    const label = range === "today" ? "vs yesterday" : "vs last period";

    return {
        text: `${diff >= 0 ? "+" : ""}${diff} ${label}`,
        tone: diff >= 0 ? 'positive' : 'negative'
    };
}

// Current Streak Metric Card

export function getCurrentStreak(sessions) {
    // 1. Safety Check: If sessions isn't an array, return 0
    if (!Array.isArray(sessions) || sessions.length === 0) return 0;

    // 2. Use the REAL today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Extract unique dates
    const uniqueDates = [
        ...new Set(sessions.map(session => session.date)),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date(today);

    // 4. Logic to check consecutive days
    for (const dateStr of uniqueDates) {
        const sessionDate = new Date(dateStr);
        sessionDate.setHours(0, 0, 0, 0);

        if (sessionDate.getTime() === currentDate.getTime()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (sessionDate.getTime() > currentDate.getTime()) {
            // Skip future dates if any exist in mock data
            continue;
        } else {
            // Gap found, streak ends
            break;
        }
    }

    return streak;
}

export function getCurrentStreakBadge(streak) {
    if (streak === 0) return { text: "Start Today", tone: "positive" };
    if (streak <= 3) return { text: "Good start, Keep Going!", tone: "positive" };
    if (streak <= 7) return { text: "Keep it up!", tone: "positive" };

    return { text: "On Fire 🔥", tone: "positive" };
}
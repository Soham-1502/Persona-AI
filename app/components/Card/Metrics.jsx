// Total Sessions Metric Card

export function getTotalSessions(sessions) {
    return sessions.length;
}

export function getTotalSessionsBadge(current, previous) {
    if (previous === 0) return "New Activity";

    const change = Math.round((current - previous) / previous * 100);

    return {
        text: `${change >= 0 ? `+${change}%` : `${change}%`}`,
        tone: `${change >= 0 ? "positive" : "negative"}`
    }
}

// Confidence Score Metric Card

export function getConfidenceScore(sessions) {
    const BASE_SCORE = 70;

    const deltaSum = sessions.reduce(
        (sum, session) => sum + session.confidenceDelta,
        0
    );

    const TotalScore = BASE_SCORE + deltaSum;

    return Math.min(100, TotalScore);
}

export function getConfidenceScoreBadge(sessions) {
    const delta = sessions.reduce(
        (sum, s) => sum + s.confidenceDelta,
        0
    );

    return {
        text: `${delta >= 0 ? "+" : "-"}${Math.abs(delta)}%`,
        tone:
            delta > 0 ? "positive" :
                delta < 0 ? "negative" :
                    "neutral",
    };
}

// Voice Quizzes Metric Card

export function getVoiceQuizzes(sessions) {
    return sessions.filter((session) => session.isVoiceQuiz).length;
}

export function getVoiceQuizzesBadge(count, range) {
    const label = range === "today" ? "today" : range === "last7" ? "this week" : "this month" ;
    
    return {
        text: `+${count} ${label}`,
        tone: 'positive'
    };
}

// Current Streak Metric Card

export function getCurrentStreak(sessions) {
    const today = new Date("2025-09-14");

    const uniqueDates = [
        ...new Set(sessions.map(session => session.date)),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date(today);

    for (const date of uniqueDates) {
        const sessionDate = new Date(date);

        if (sessionDate.toDateString() === currentDate.toDateString()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

export function getCurrentStreakBadge(streak) {
    if (streak === 0) return {text: "Start Today", tone: "positive" };
    if (streak <= 3) return {text:"Good start, Keep Going!", tone: "positive" };
    if (streak <= 7) return {text:"Keep it up!", tone: "positive" };

    return { text: "On Fire 🔥", tone: "positive" };
}
import mongoose from 'mongoose';

const ConfidenceCoachSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    userAnswer: { type: String, required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    metrics: {
        eyeContact: Number,
        posture: Number,
        emotion: String,
        vocalStability: Number,
        pacing: Number,
        wpm: Number,
        fillers: Number
    },
    meta: {
        fillers: Number,
        wordCount: Number,
        wpm: Number,
        pitchStability: Number,
        energyTrend: String
    },
    completedAt: { type: Date, default: Date.now, index: true }
});

export const ConfidenceCoachSession = mongoose.models.ConfidenceCoachSession || mongoose.model('ConfidenceCoachSession', ConfidenceCoachSessionSchema);

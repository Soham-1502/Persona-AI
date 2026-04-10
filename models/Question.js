import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    scenario: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    questions: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d', // Auto-expire documents after 7 days
    }
});

// Create compound index for fast lookups
QuestionSchema.index({ scenario: 1, difficulty: 1 });

export const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

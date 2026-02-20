// models/UserAttempt.js
import mongoose from "mongoose";

const userAttemptSchema = new mongoose.Schema({
  // Link to User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },

  // ── Module identifier ──────────────────────────────────────────────────────
  // Which product/module this attempt belongs to.
  // inQuizzo attempts are created by the existing quiz API (gameType: quiz/mcq/voice).
  // socialMentor attempts are created by app/api/mentor/route.js.
  // microLearning and confidenceCoach attempts are created by their respective APIs.
  moduleId: {
    type: String,
    enum: ['inQuizzo', 'socialMentor', 'microLearning', 'confidenceCoach'],
    required: true,
    default: 'inQuizzo', // preserves backward compatibility for existing quiz attempts
  },

  // Game Session Info
  sessionId: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: ['quiz', 'mcq', 'voice', 'chat', 'lesson'],
    default: 'quiz'
  },

  // Question / Interaction Details
  questionId: String,
  question: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['text', 'voice', 'multiple-choice', 'open-ended'],
    default: 'text'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },

  // Answer Details
  userAnswer: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },

  // AI Analysis
  similarity: {
    type: Number,
    min: 0,
    max: 100
  },
  aiAnalysis: {
    reasoning: String,
    confidence: Number,
    suggestions: [String]
  },

  // Scoring
  score: {
    type: Number,
    default: 0
  },
  maxPossibleScore: {
    type: Number,
    default: 10
  },
  timeTaken: {
    type: Number, // seconds
    default: 0
  },

  // Voice Specific
  voiceData: {
    audioUrl: String,
    transcription: String,
    confidence: Number,
    language: String
  },

  // Metadata
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// ── Indexes ────────────────────────────────────────────────────────────────────
userAttemptSchema.index({ userId: 1, timestamp: -1 });
userAttemptSchema.index({ userId: 1, moduleId: 1, timestamp: -1 }); // for per-module aggregation
userAttemptSchema.index({ sessionId: 1 });
userAttemptSchema.index({ username: 1, gameType: 1 });

// ── Virtual ────────────────────────────────────────────────────────────────────
userAttemptSchema.virtual('scorePercentage').get(function () {
  if (this.maxPossibleScore === 0) return 0;
  return Math.round((this.score / this.maxPossibleScore) * 100);
});

// ── Static methods ─────────────────────────────────────────────────────────────
userAttemptSchema.statics.getUserHistory = function (userId, limit = 10) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'username email gameStats');
};

userAttemptSchema.statics.getSessionAttempts = function (sessionId) {
  return this.find({ sessionId }).sort({ timestamp: 1 });
};

userAttemptSchema.set('toJSON', { virtuals: true });

const UserAttempt = mongoose.models.UserAttempt ||
  mongoose.model("UserAttempt", userAttemptSchema);

export default UserAttempt;
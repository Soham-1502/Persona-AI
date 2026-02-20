import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    id: String,
    role: String,
    text: String,
    timestamp: Date,
});

const chatSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        default: 'New Conversation',
    },
    messages: [messageSchema],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

const ChatSession = mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;

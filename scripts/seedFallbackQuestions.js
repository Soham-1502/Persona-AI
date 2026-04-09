import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FallbackQuestion from "../models/FallbackQuestion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;
const GEMINI_API_KEYS = Object.entries(process.env)
    .filter(([name, value]) => /^GEMINI_API_KEY/i.test(name) && value)
    .map(([, value]) => value);

if (!MONGO_URI || GEMINI_API_KEYS.length === 0) {
    console.error("❌ Missing MONGO_URI or GEMINI_API_KEY entries in .env");
    process.exit(1);
}

// Global state for keys
let currentKeyIndex = 0;
let genAI = new GoogleGenerativeAI(GEMINI_API_KEYS[currentKeyIndex]);
let model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function switchToNextKey() {
    currentKeyIndex++;
    if (currentKeyIndex < GEMINI_API_KEYS.length) {
        console.log(`🔄 Switching to Gemini API Key #${currentKeyIndex + 1}...`);
        genAI = new GoogleGenerativeAI(GEMINI_API_KEYS[currentKeyIndex]);
        model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        return true;
    }
    return false;
}

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: "User" });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
}

async function generateBatch(difficulty, count, existingQuestions) {
    const prompt = `Generate a JSON array of UNIQUE "${difficulty}" quiz questions. Return EXACTLY ${count} questions.
  Difficulty Levels:
  - easy: simple, basic factual, one-line answers
  - medium: intermediate, concepts, categories, comparisons
  - hard: advanced, deep dives, real-world challenges, complex problem solving

  Rules:
  1. Return ONLY a valid JSON array of objects: [{"question": "...", "answer": "..."}]
  2. Do NOT repeat these questions: ${existingQuestions.slice(-30).join(", ")}
  3. Ensure questions are highly diverse across various subjects.
  4. NO markdown, NO text before or after the JSON array.

  Output format: [{"question": "...", "answer": "..."}]`;

    let retries = 3;
    while (retries > 0) {
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
            if (!jsonMatch) throw new Error("Could not find JSON array in response");
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.length > 0) return parsed;
            throw new Error("Zero questions in JSON array");
        } catch (err) {
            console.error(`⚠️ Error for ${difficulty}:`, err.message);
            
            // Try switching to next key if we hit a rate limit or other error
            if (switchToNextKey()) {
                console.log("♻️ Retrying with new key...");
                continue; // retry loop with same retries count but new key
            }

            retries--;
            console.warn(`⏳ Retrying in 2s... (${retries} retries left)`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    return [];
}

async function seed() {
    await connectDB();

    console.log("📦 Inserting initial manual fallbacks...");
    const manualFallbacks = [
        { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean", difficulty: "easy" },
        { question: "What is the chemical symbol for Gold?", answer: "Au", difficulty: "easy" },
        { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare", difficulty: "easy" },
        { question: "What is the capital of Japan?", answer: "Tokyo", difficulty: "easy" },
        { question: "How many continents are there?", answer: "7", difficulty: "easy" },

        { question: "What is the process by which plants make their own food?", answer: "Photosynthesis", difficulty: "medium" },
        { question: "Which planet is known as the Red Planet?", answer: "Mars", difficulty: "medium" },
        { question: "What is the hardest natural substance on Earth?", answer: "Diamond", difficulty: "medium" },
        { question: "In which year did World War II end?", answer: "1945", difficulty: "medium" },
        { question: "What is the smallest prime number?", answer: "2", difficulty: "medium" },

        { question: "What is the phenomenon where light bends as it passes from one medium to another?", answer: "Refraction", difficulty: "hard" },
        { question: "Who is considered the father of modern physics?", answer: "Albert Einstein", difficulty: "hard" },
        { question: "What is the most abundant gas in Earth's atmosphere?", answer: "Nitrogen", difficulty: "hard" },
        { question: "Which ancient civilization built the Machu Picchu?", answer: "Inca", difficulty: "hard" },
        { question: "What is the term for a word that is spelled the same forwards and backwards?", answer: "Palindrome", difficulty: "hard" }
    ];

    try {
        await FallbackQuestion.insertMany(manualFallbacks, { ordered: false });
        console.log("✅ Manual fallbacks inserted.");
    } catch (err) {
        console.log("⚠️ Manual fallbacks already exist or some failed.");
    }

    const difficulties = ["easy", "medium", "hard"];
    const targetCount = 500;
    const batchSize = 30; // Increased batch size

    for (const difficulty of difficulties) {
        console.log(`\n🚀 Seeding ${difficulty} questions...`);
        let currentCount = await FallbackQuestion.countDocuments({ difficulty });
        console.log(`📈 Current ${difficulty} count: ${currentCount}`);

        while (currentCount < targetCount) {
            const remaining = targetCount - currentCount;
            const toGenerate = Math.min(batchSize, remaining);

            console.log(`📝 Generating ${toGenerate} more ${difficulty} questions (Progress: ${currentCount}/500)`);

            // Get some existing questions to avoid duplicates (just the first 10 for prompt context)
            const existing = await FallbackQuestion.find({ difficulty }).limit(10).select('question');
            const existingTexts = existing.map(q => q.question);

            const batch = await generateBatch(difficulty, toGenerate, existingTexts);

            if (batch.length > 0) {
                const docs = batch.map(q => ({
                    ...q,
                    difficulty
                }));

                try {
                    await FallbackQuestion.insertMany(docs, { ordered: false });
                    currentCount += docs.length;
                    console.log(`✅ Progress: ${currentCount}/${targetCount} for ${difficulty}`);
                } catch (insertErr) {
                    console.error("⚠️ Some insertions failed (possibly duplicates), continuing...");
                    currentCount = await FallbackQuestion.countDocuments({ difficulty });
                }
            } else {
                console.log("⚠️ Batch was empty, retrying...");
            }

            // Add a larger delay between batches to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    console.log("\n✨ Seeding completed successfully!");
    process.exit(0);
}

seed();

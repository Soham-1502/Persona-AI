/**
 * gemini-keys.js
 *
 * Universal Gemini API key collector.
 *
 * Automatically discovers EVERY env var whose name starts with "GEMINI_API_KEY"
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiChain, isKeyRateLimited, markKeyRateLimited, runGroqAction } from '@/lib/ai-handler';

/**
 * Returns all Gemini API keys found in process.env.
 * @returns {string[]}
 */
export function getGeminiKeys() {
    return getGeminiChain();
}

/**
 * Executes `fn` with a GoogleGenerativeAI client, automatically retrying across
 * every discovered API key when one fails.
 * 
 * It also automatically falls back from gemini-2.0-flash to gemini-1.5-flash 
 * on each key before moving to the next key.
 * 
 * NEW: If all Gemini options fail, it falls back to Groq (Llama-3) as a safety net.
 */
export async function withGeminiFallback(taskFn, options = {}) {
    const keys = getGeminiChain();
    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    const errors = [];

    // 1. Try Gemini Chain First
    if (keys.length > 0) {
        for (const modelName of models) {
            for (const key of keys) {
                const trimmedKey = key.trim();
                if (!trimmedKey) continue;

                if (isKeyRateLimited(trimmedKey, modelName)) {
                    continue;
                }

                try {
                    const genAI = new GoogleGenerativeAI(trimmedKey);
                    // Pass a third 'provider' argument so taskFn knows how to handle the client
                    return await taskFn(genAI, modelName, 'gemini');
                } catch (err) {
                    const message = err.message || "";
                    const isRateLimit = message.includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate limit");
                    
                    console.warn(`⚠️ Gemini key failed (${trimmedKey.substring(0, 10)}... | ${modelName}): ${message}`);
                    errors.push(`Gemini ${modelName}: ${message}`);

                    if (isRateLimit) {
                        markKeyRateLimited(trimmedKey, modelName, message);
                        continue;
                    } else {
                        markKeyRateLimited(trimmedKey, modelName, "try again in 24h");
                        continue;
                    }
                }
            }
        }
    }

    // 2. Secondary Fallback: Groq (Llama)
    console.log("📡 All Gemini options exhausted. Attempting Groq secondary fallback...");
    try {
        return await runGroqAction(async (groq, modelName) => {
            // Adapt the Gemini-style taskFn to Groq
            // We pass the groq instance as the first arg and modelName as second
            return await taskFn(groq, modelName, 'groq');
        });
    } catch (groqErr) {
        errors.push(`Groq Fallback: ${groqErr.message}`);
    }

    throw new Error(
        options.fallbackMessage ||
        `All Gemini and Groq options exhausted. Last error: ${errors[errors.length - 1]}`
    );
}



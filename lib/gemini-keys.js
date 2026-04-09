/**
 * gemini-keys.js
 *
 * Universal Gemini API key collector.
 *
 * Automatically discovers EVERY env var whose name starts with "GEMINI_API_KEY"
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiChain, isKeyRateLimited, markKeyRateLimited } from '@/lib/ai-handler';

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
 */
export async function withGeminiFallback(taskFn, options = {}) {
    const keys = getGeminiChain();
    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    const errors = [];

    if (keys.length === 0) {
        throw new Error('No GEMINI_API_KEY entries found in environment variables.');
    }

    // Try models in order (2.0 first, then 1.5 as backup)
    for (const modelName of models) {
        for (const key of keys) {
            const trimmedKey = key.trim();
            if (!trimmedKey) continue;

            // Check if this specific key/model combo is already known to be limited
            if (isKeyRateLimited(trimmedKey, modelName)) {
                continue;
            }

            try {
                const genAI = new GoogleGenerativeAI(trimmedKey);
                // We pass the model name to the task function so it can use the correct one
                return await taskFn(genAI, modelName);
            } catch (err) {
                const message = err.message || "";
                const isRateLimit = message.includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate limit");
                
                console.warn(`⚠️ Gemini key failed (${trimmedKey.substring(0, 10)}... | ${modelName}): ${message}`);
                errors.push(`${modelName}: ${message}`);

                if (isRateLimit) {
                    // Mark this key as limited for this model for 60 seconds (Gemini resets every minute usually)
                    markKeyRateLimited(trimmedKey, modelName, message);
                    continue; // Try next key for THIS model
                } else {
                    // Fatal error for this key (e.g. invalid key), mark it limited for 24h
                    markKeyRateLimited(trimmedKey, modelName, "try again in 24h");
                    continue;
                }
            }
        }
        // If we exhausted all keys for the first model, the loop will move to the next model (1.5-flash)
        console.log(`📡 All keys failed for ${modelName}, falling back to next available model...`);
    }

    throw new Error(
        options.fallbackMessage ||
        `All Gemini API keys and models exhausted. Last error: ${errors[errors.length - 1]}`
    );
}


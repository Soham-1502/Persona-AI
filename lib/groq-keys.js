/**
 * groq-keys.js
 *
 * Convenience re-export of the universal Groq key utilities.
 * The source of truth lives in lib/ai-handler.js (getGroqChain).
 *
 * Usage:
 *   import { getGroqKeys, withGroqFallback } from '@/lib/groq-keys';
 *
 * Adding a new key: just add any var starting with GROQ_API_KEY to .env:
 *   GROQ_API_KEY_5=gsk_...
 *   GROQ_API_KEY_TEAM=gsk_...
 *   (any suffix works, unlimited keys)
 */

import Groq from 'groq-sdk';
import { getGroqChain } from '@/lib/ai-handler';

/**
 * Returns all Groq API keys found in process.env.
 * @returns {string[]}
 */
export function getGroqKeys() {
    return getGroqChain();
}

/**
 * Executes `fn` with a Groq client, automatically retrying across
 * every discovered API key when one fails.
 *
 * @template T
 * @param {(groqClient: import('groq-sdk').Groq) => Promise<T>} fn
 * @param {{ fallbackMessage?: string }} [options]
 * @returns {Promise<T>}
 */
export async function withGroqFallback(fn, options = {}) {
    const keys = getGroqChain();

    if (keys.length === 0) {
        throw new Error('No GROQ_API_KEY entries found in environment variables.');
    }

    let lastError = null;
    for (const key of keys) {
        try {
            const groqClient = new Groq({ apiKey: key });
            return await fn(groqClient);
        } catch (err) {
            console.warn(`⚠️ Groq key failed (${key.substring(0, 10)}...): ${err.message}`);
            lastError = err;
        }
    }

    throw new Error(
        options.fallbackMessage ||
        `All ${keys.length} Groq API key(s) failed. Last error: ${lastError?.message}`
    );
}

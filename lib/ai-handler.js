import Groq from "groq-sdk";

/**
 * Returns an array of available Groq API keys from the environment.
 */
export function getGroqChain() {
    return [
        process.env.GROQ_API_KEY_REGULAR,
        process.env.GROQ_API_KEY_SUB_1,
        process.env.GROQ_API_KEY_SUB_2,
        process.env.GROQ_API_KEY_SUB_3,
        process.env.GROQ_API_KEY_SUB_4,
        process.env.GROQ_API_KEY_SUB_5,
    ].filter(Boolean);
}

/**
 * Runs an async task with Groq, automatically falling back through the key chain if a rate limit is hit.
 * @param {Function} taskFn - The task to run, receives a groq instance. e.g. (groq) => groq.chat.completions.create(...)
 * @returns {Promise<any>}
 */
export async function runGroqAction(taskFn) {
    const keys = getGroqChain();
    const errors = [];
    // Tiered models to try for each key
    const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i].trim();
        if (!key || key.includes(" ")) continue;

        const groq = new Groq({ apiKey: key });
        const keyLabel = i === 0 ? "Regular" : `Substitute ${i}`;

        for (const model of models) {
            try {
                console.log(`🚀 Attempting Groq with ${keyLabel} key using ${model}...`);
                return await taskFn(groq, model);
            } catch (error) {
                const isRateLimit = error.status === 429 || error.message?.includes("rate limit");
                const isDecommissioned = error.status === 400 && error.message?.includes("decommissioned");
                const errorMsg = `Groq ${keyLabel} (${model}) failed: ${error.message}`;

                console.warn(`⚠️ ${errorMsg}`);
                errors.push(errorMsg);

                // If it's a model specific error (429/400), try the next model on the same key
                // If it's an auth error (401), break to the next key
                if (error.status === 401) {
                    console.log(`❌ Auth error for ${keyLabel} key. Moving to next account...`);
                    break;
                }
            }
        }

        if (i === keys.length - 1) {
            throw new Error(`All Groq keys and models exhausted. Errors: ${errors.join(" | ")}`);
        }
    }
}

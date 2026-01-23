const { GoogleGenerativeAI } = require("@google/generative-ai");

try {
    console.log("Initializing Gemini with empty key...");
    const genAI = new GoogleGenerativeAI(""); // Simulate missing key
    console.log("Initialization success (unexpected if key is required).");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Model getter success.");

} catch (error) {
    console.error("Crashed as expected:", error.message);
}

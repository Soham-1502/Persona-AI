import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Safely extracts and parses JSON from LLM responses, 
 * handling cases where the AI wraps output in markdown code blocks.
 */
function extractJSON(text) {
  try {
    // Regex to find content between ```json and ``` or just ``` and ```
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = match ? match[1] : text;
    return JSON.parse(jsonString.trim());
  } catch (e) {
    console.error("Raw AI response that failed to parse:", text);
    throw new Error("Failed to parse AI response as JSON");
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { transcript, userExplanation } = body;

    if (!transcript || !userExplanation) {
      return Response.json(
        { success: false, error: "Missing transcript or explanation" },
        { status: 400 }
      );
    }

    console.log("Checking understanding...");

    // Common system message to force JSON format
    const systemPrompt = "You are a specialized JSON generator. You must return ONLY valid, raw JSON. No conversational text, no markdown code blocks, and no backticks.";

    // --- Step 1: Calculate accuracy ---
    const accuracyPrompt = `
Compare the user's explanation with the original transcript and calculate accuracy percentage.

Original Transcript:
${transcript}

User's Explanation:
${userExplanation}

JSON Structure:
{
  "accuracy_percentage": 75,
  "key_points_covered": ["point1", "point2"],
  "key_points_missed": ["point3"]
}
`;

    const accuracyResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: accuracyPrompt },
      ],
      temperature: 0.3, // Lower temperature for more consistent JSON
      max_tokens: 1024,
    });

    const accuracyText = accuracyResponse.choices[0].message.content;
    const accuracyData = extractJSON(accuracyText);
    const accuracy = accuracyData.accuracy_percentage;

    console.log("Accuracy calculated:", accuracy);

    let responseData = {
      success: true,
      accuracy: accuracy,
      keyPointsCovered: accuracyData.key_points_covered,
      keyPointsMissed: accuracyData.key_points_missed,
    };

    // --- Step 2: Adaptive Feedback ---
    if (accuracy < 60) {
      console.log("Generating diagnostic questions...");
      const mcqPrompt = `Generate 3 diagnostic MCQs based on this transcript: ${transcript}. Use this format: [{"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "answer": "A"}]`;

      const mcqResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: mcqPrompt },
        ],
        temperature: 0.7,
      });

      responseData.diagnosticQuestions = extractJSON(mcqResponse.choices[0].message.content);
      responseData.feedbackType = "diagnostic";
      responseData.feedback = `Your understanding is ${accuracy}% accurate. Let's do a quick diagnostic test.`;

    } else if (accuracy >= 60 && accuracy < 80) {
      console.log("Generating improvement suggestions...");
      const improvementPrompt = `Provide 2-3 improvement areas for this user explanation: ${userExplanation} based on transcript: ${transcript}. Format: {"summary": "...", "areas_to_improve": [{"area": "...", "current_understanding": "...", "what_to_improve": "...", "how_to_improve": "..."}]}`;

      const improvementResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: improvementPrompt },
        ],
        temperature: 0.7,
      });

      responseData.improvements = extractJSON(improvementResponse.choices[0].message.content);
      responseData.feedbackType = "improvement";
      responseData.feedback = `Great job! You're at ${accuracy}%. Here is how to reach the next level.`;

    } else {
      console.log("Generating advanced suggestions...");
      const advancedPrompt = `Provide 2-3 advanced topics to deepen knowledge. Format: {"summary": "...", "advanced_topics": [{"topic": "...", "why_important": "...", "how_to_explore": "..."}], "expert_tips": ["...", "..."]}`;

      const advancedResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: advancedPrompt },
        ],
        temperature: 0.7,
      });

      responseData.advanced = extractJSON(advancedResponse.choices[0].message.content);
      responseData.feedbackType = "advanced";
      responseData.feedback = `Outstanding! ${accuracy}% accuracy. Ready to go deeper?`;
    }

    return Response.json(responseData);

  } catch (error) {
    console.error("Understanding Check Error:", error.message);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
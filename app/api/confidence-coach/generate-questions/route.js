import { NextResponse } from 'next/server';
import { withGeminiFallback } from '@/lib/gemini-keys';
import connectDB from '@/lib/db';
import { Question } from '@/models/Question';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { scenarioType, difficulty = "Beginner", previousQuestions = [] } = body;

        if (!scenarioType) {
            return NextResponse.json({ success: false, error: 'scenarioType is required' }, { status: 400 });
        }

        let selectedQuestion = null;
        let cacheCheckRetries = 3;

        // Attempt up to 3 times to atomically grab a valid question from cache
        while (!selectedQuestion && cacheCheckRetries > 0) {
            const cacheDoc = await Question.findOne({ scenario: scenarioType, difficulty });
            
            if (cacheDoc && cacheDoc.questions.length >= 5) {
                const validQuestions = cacheDoc.questions.filter(q => !previousQuestions.includes(q));
                
                if (validQuestions.length > 0) {
                    const candidate = validQuestions[Math.floor(Math.random() * validQuestions.length)];
                    
                    // Atomically pull to prevent race condition (e.g. 2 simultaneous requests returning same question)
                    const updateResult = await Question.findOneAndUpdate(
                        { scenario: scenarioType, difficulty, questions: candidate },
                        { $pull: { questions: candidate } },
                        { new: true }
                    );

                    if (updateResult) {
                        selectedQuestion = candidate;
                        break; 
                    }
                    // If updateResult is null, the chosen question was just pulled by another request. Loop and retry.
                } else {
                    break; // Have questions, but none are valid. Force new Gemini generation.
                }
            } else {
                break; // Less than 5 questions, trigger generation buffer.
            }
            cacheCheckRetries--;
        }

        // Cache hit -> instantly return
        if (selectedQuestion) {
            return NextResponse.json({ success: true, question: selectedQuestion });
        }

        // Cache miss -> Generate 20 and refill buffer
        let difficultyModifiers = "";
        if (difficulty === "Beginner") {
            difficultyModifiers = "Make them simple, common, and straightforward.";
        } else if (difficulty === "Intermediate") {
            difficultyModifiers = "Make them slightly challenging and require some thought.";
        } else if (difficulty === "Expert") {
            difficultyModifiers = "Make them highly complex, aggressive, tricky, or niche to simulate intense pressure.";
        }

        let antiRepetition = "";
        if (Array.isArray(previousQuestions) && previousQuestions.length > 0) {
            antiRepetition = `\n\nCRITICAL: DO NOT generate any of the following questions or anything extremely similar: ${previousQuestions.join(' | ')}`;
        }

        const prompt = `Generate exactly 20 realistic practice questions for a "${scenarioType}" scenario, to be spoken aloud by the user. ${difficultyModifiers} Return ONLY a JSON array of strings containing the questions. Do not include markdown formatting or the \`\`\`json block. Just the raw array bracket.${antiRepetition}`;

        const text = await withGeminiFallback(async (client, modelName, provider) => {
            if (provider === 'gemini') {
                const model = client.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                return result.response.text().trim();
            } else {
                // Groq Fallback Adapter
                const completion = await client.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: modelName,
                    temperature: 0.7,
                });
                return completion.choices[0]?.message?.content || "";
            }
        });

        // Parse JSON safely
        let questionsArray = [];
        try {
            questionsArray = JSON.parse(text);
        } catch (e) {
            // Regex fallback if LLM wraps in markdown
            const match = text.match(/\[.*\]/s);
            if (match) {
                try {
                    questionsArray = JSON.parse(match[0]);
                } catch (innerE) {
                    console.error("Failed to parse JSON array from regex match:", innerE);
                }
            }
        }

        // Clean-split fallback if all JSON parsing utterly fails
        if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
            questionsArray = text.split('\n')
                                 .map(q => q.trim().replace(/^[\d\-\*\.]+\s*/, '').replace(/^"|"$/g, ''))
                                 .filter(q => q.length > 10);
        }

        // Sanity fallback: if EVERYTHING failed we just provide a basic single question
        if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
            questionsArray = [`Can you describe a challenging situation in a ${scenarioType} scenario?`];
        }

        // Select the one question we intend to immediately return (avoid previousQuestions)
        let validGenerated = questionsArray.filter(q => !previousQuestions.includes(q));
        if (validGenerated.length === 0) validGenerated = questionsArray; 

        const questionToReturn = validGenerated[0];

        // The remaining 19 go straight to MongoDB
        const questionsToCache = questionsArray.filter(q => q !== questionToReturn);

        if (questionsToCache.length > 0) {
            await Question.findOneAndUpdate(
                { scenario: scenarioType, difficulty },
                { 
                    $push: { questions: { $each: questionsToCache } },
                    $setOnInsert: { createdAt: new Date() }
                },
                { upsert: true }
            );
        }

        return NextResponse.json({ success: true, question: questionToReturn });
    } catch (error) {
        console.error('Error generating AI question:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error while generating question.' },
            { status: 500 }
        );
    }
}

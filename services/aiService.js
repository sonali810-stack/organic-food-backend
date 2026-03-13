const { GoogleGenerativeAI } = require('@google/generative-ai');

const ACK_MESSAGES = new Set([
    'ok',
    'okay',
    'k',
    'kk',
    'thanks',
    'thank you',
    'thx',
    'got it',
    'great'
]);

const getSuggestedQuestions = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('protein')) {
        return [
            'Suggest high-protein breakfast ideas',
            'Which organic snacks are rich in protein?',
            'Give me a simple protein-friendly grocery list'
        ];
    }

    if (lowerCaseMessage.includes('weight') || lowerCaseMessage.includes('diet')) {
        return [
            'Suggest low-calorie breakfast foods',
            'What organic foods are good for light dinners?',
            'Build a simple healthy shopping list for a week'
        ];
    }

    if (lowerCaseMessage.includes('kid') || lowerCaseMessage.includes('child')) {
        return [
            'Suggest healthy snacks for school',
            'What fruits are easy for kids to eat daily?',
            'Give me a simple breakfast plan for children'
        ];
    }

    return [
        'Suggest a healthy breakfast',
        'What organic snacks should I buy?',
        'Give me a simple grocery list for a week'
    ];
};

const formatHistoryForPrompt = (history = []) => {
    return history
        .slice(-8)
        .map((item) => {
            const role = item.role === 'assistant' ? 'Assistant' : 'User';
            return `${role}: ${String(item.text || '').trim()}`;
        })
        .filter((line) => line.length > 0)
        .join('\n');
};

const buildPrompt = (message, history = []) => {
    const historyBlock = formatHistoryForPrompt(history);

    return `You are a helpful assistant for an organic food shopping website.
Answer in simple language for a beginner-level shopper.
Keep answers short, practical, and easy to understand.
Suggest healthy food options when relevant.
Do not give medical diagnosis, treatment, or unsafe health advice.
If the user asks a medical question, politely say you can only give general food guidance.
Do not use markdown symbols like *, **, #, or bullet formatting.
Reply in plain readable sentences.

Recent conversation:
${historyBlock || 'No prior conversation.'}

User question: ${message}`;
};

const isAcknowledgement = (message) => {
    const normalized = message.toLowerCase().trim();
    return ACK_MESSAGES.has(normalized);
};

const generateChatReply = async (message, history = []) => {
    if (!process.env.GEMINI_API_KEY) {
        const error = new Error('GEMINI_API_KEY is missing in backend environment variables');
        error.status = 500;
        throw error;
    }

    if (isAcknowledgement(message)) {
        return {
            reply: 'Perfect. Want help with breakfast ideas, snacks, or a simple weekly grocery list?',
            suggestions: [
                'Suggest a healthy breakfast',
                'What organic snacks should I buy?',
                'Give me a simple grocery list for a week'
            ]
        };
    }

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    });

    const result = await model.generateContent(buildPrompt(message, history));
    const reply = result.response.text().trim();

    return {
        reply,
        suggestions: getSuggestedQuestions(message)
    };
};

module.exports = {
    generateChatReply
};
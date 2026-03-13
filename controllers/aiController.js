const { generateChatReply } = require('../services/aiService');

const chatWithAssistant = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a message'
            });
        }

        const safeHistory = Array.isArray(history)
            ? history
                .filter((item) => item && typeof item.text === 'string')
                .map((item) => ({
                    role: item.role === 'assistant' ? 'assistant' : 'user',
                    text: item.text
                }))
            : [];

        const data = await generateChatReply(message.trim(), safeHistory);

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('AI chat error:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to get chatbot response'
        });
    }
};

module.exports = {
    chatWithAssistant
};
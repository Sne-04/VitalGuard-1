const axios = require('axios');

class LLMFallbackChain {
    constructor() {
        this.openaiKey = process.env.OPENAI_API_KEY;
        this.geminiKey = process.env.GEMINI_API_KEY;
        this.groqKey = process.env.GROQ_API_KEY;
        this.openRouterKey = process.env.OPENROUTER_API_KEY;
    }

    async generateWithOpenAI(system, user) {
        if (!this.openaiKey) throw new Error('No OpenAI key');
        const res = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${this.openaiKey}`, 'Content-Type': 'application/json' }
        });
        return res.data.choices[0].message.content;
    }

    async generateWithGroq(system, user) {
        if (!this.groqKey) throw new Error('No Groq key');
        const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama3-70b-8192',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${this.groqKey}`, 'Content-Type': 'application/json' }
        });
        return res.data.choices[0].message.content;
    }

    async generateWithGemini(system, user) {
        if (!this.geminiKey) throw new Error('No Gemini key');
        const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`, {
            system_instruction: { parts: { text: system } },
            contents: [{ parts: [{ text: user }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return res.data.candidates[0].content.parts[0].text;
    }

    async generateWithOpenRouter(system, user) {
        if (!this.openRouterKey) throw new Error('No OpenRouter key');
        const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'anthropic/claude-3.5-sonnet',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${this.openRouterKey}`, 'Content-Type': 'application/json' }
        });
        return res.data.choices[0].message.content;
    }

    async analyze(systemPrompt, userPrompt) {
        const chain = [
            { name: 'Groq', fn: () => this.generateWithGroq(systemPrompt, userPrompt) },
            { name: 'OpenAI', fn: () => this.generateWithOpenAI(systemPrompt, userPrompt) },
            { name: 'Gemini', fn: () => this.generateWithGemini(systemPrompt, userPrompt) },
            { name: 'OpenRouter', fn: () => this.generateWithOpenRouter(systemPrompt, userPrompt) }
        ];

        let lastError = null;
        for (const model of chain) {
            try {
                console.log(`[LLM Chain] Attempting with ${model.name}...`);
                const result = await model.fn();
                if (result) {
                    console.log(`[LLM Chain] Success with ${model.name}!`);
                    return result;
                }
            } catch (err) {
                console.warn(`[LLM Chain] ${model.name} failed:`, err?.response?.data || err.message);
                lastError = err;
            }
        }
        throw new Error('All LLMs in the fallback chain failed. Last error: ' + (lastError?.message || 'Unknown'));
    }
}

module.exports = new LLMFallbackChain();

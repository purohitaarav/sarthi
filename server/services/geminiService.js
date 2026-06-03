const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    // Standard model names for Gemini
    this.modelName = 'gemini-3-flash-preview';
    this.embeddingModelName = 'gemini-embedding-2';
    this.genAI = null;

    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      console.log(`✅ GeminiService initialized with model: ${this.modelName}`);
    } else {
      console.warn('⚠️ GEMINI_API_KEY is missing. Service will fail.');
    }
  }

  // Internal helper for timeouts
  async _withTimeout(promise, ms, label) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`[Gemini] ${label} timed out after ${ms}ms`)), ms)
      )
    ]);
  }

  /**
   * Generate embeddings using Gemini
   * @param {string} prompt - Text to embed
   * @returns {Promise<Array<number>>} - Embedding vector
   */
  async getBgePipeline() {
    if (!this.bgePipeline) {
      const { pipeline, env } = require('@xenova/transformers');
      const path = require('path');
      env.cacheDir = path.join(__dirname, '../.cache');
      console.log('[BGE] 📦 Loading BGE-small-en-v1.5 model...');
      this.bgePipeline = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
      console.log('[BGE] ✅ BGE model loaded successfully');
    }
    return this.bgePipeline;
  }

  /**
   * Generate embeddings using local BGE model
   * @param {string} prompt - Text to embed
   * @returns {Promise<Array<number>>} - Embedding vector
   */
  async generateEmbedding(prompt) {
    const start = Date.now();
    try {
      console.log(`[BGE] 🔵 START: Generating local BGE embedding`);
      const pipe = await this.getBgePipeline();
      const text = prompt.trim();
      const output = await pipe(text, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data);
      console.log(`[BGE] ✅ DONE: Embedding generated locally in ${Date.now() - start}ms (dims: ${embedding.length})`);
      return embedding;
    } catch (error) {
      console.error('[BGE] ❌ Failed to generate BGE embedding:', error.message);
      throw error;
    }
  }

  /**
   * Generate a response using Gemini 2.5 Pro
   * @param {string} prompt - User's question/prompt
   * @param {string} systemPrompt - System instructions for the model
   * @param {boolean} stream - Whether to stream the response (not fully impl here for simplicity)
   * @returns {Promise<string>} - Model's response
   */
  async generateResponse(prompt, systemPrompt = '', stream = false) {
    if (!this.genAI) throw new Error('Gemini API Key missing');
    const start = Date.now();
    try {
      console.log(`[Gemini] 🔵 START: Generating response (timeout: 30s, prompt length: ${prompt.length})`);
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt
      });

      const result = await this._withTimeout(
        model.generateContent(prompt),
        30000,
        'Generation'
      );
      const response = await result.response;
      const text = response.text();
      console.log(`[Gemini] ✅ DONE: Response generated in ${Date.now() - start}ms (${text.length} chars)`);
      return text;
    } catch (error) {
      console.error(`[Gemini] ❌ ERROR: Generation failed after ${Date.now() - start}ms:`, error.message);
      throw error;
    }
  }

  /**
   * Chat with context using Gemini 2.5 Pro
   * @param {Array} messages - Array of {role, content}
   * @param {string} systemPrompt - System instructions
   * @returns {Promise<string>} - Model's response
   */
  async chat(messages, systemPrompt = '') {
    if (!this.genAI) throw new Error('Gemini API Key missing');
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt
      });

      // Convert standard messages to Gemini history format
      // Note: Gemini expects 'user' or 'model' roles. 
      // Filter out system messages from history as they go to systemInstruction
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

      // The last message is the new prompt, remove it from history
      const lastMsg = history.pop();
      const chat = model.startChat({ history });

      if (lastMsg) {
        const result = await chat.sendMessage(lastMsg.parts[0].text);
        return result.response.text();
      }
      return '';

    } catch (error) {
      console.error('Gemini Chat Error:', error.message);
      throw new Error(`Failed to chat: ${error.message}`);
    }
  }

  /**
   * Check if Gemini service is available
   * @returns {Promise<boolean>}
   */
  async checkHealth() {
    if (!this.genAI) return false;
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      // Use shorter timeout for health check
      await this._withTimeout(
        model.generateContent({
          contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
          generationConfig: { maxOutputTokens: 1 }
        }),
        5000,
        'Health check'
      );
      return true;
    } catch (error) {
      console.error('[Gemini] Health Check Failed:', error.message);
      return false;
    }
  }

  /**
   * List available models
   * @returns {Promise<Array>}
   */
  async listModels() {
    // Return statically or strict list as requested
    return [
      { name: this.modelName },
      { name: this.embeddingModelName }
    ];
  }
}

module.exports = new GeminiService();

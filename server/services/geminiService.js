const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = 'gemini-2.5-flash';
    // Using standard embedding model as 2.5-pro is a generation model
    this.embeddingModelName = 'text-embedding-004';
    this.genAI = null;

    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    } else {
      console.warn('⚠️ GEMINI_API_KEY is missing. Service will fail.');
    }
  }

  /**
   * Generate embeddings using Gemini
   * @param {string} prompt - Text to embed
   * @returns {Promise<Array<number>>} - Embedding vector
   */
  async generateEmbedding(prompt) {
    if (!this.genAI) throw new Error('Gemini API Key missing');
    try {
      const model = this.genAI.getGenerativeModel({ model: this.embeddingModelName });
      const result = await model.embedContent(prompt);
      return result.embedding.values;
    } catch (error) {
      console.error('Gemini Embeddings Error:', error.message);
      throw new Error(`Failed to generate embedding: ${error.message}`);
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
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Generation Error:', error.message);
      throw new Error(`Failed to generate response: ${error.message}`);
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
      // Light probe: try to get model info or just instantiate
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      // We'll trust it works if we have the object, or try a dry run?
      // A dry run is safer to prove connectivity
      await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
        generationConfig: { maxOutputTokens: 1 }
      });
      return true;
    } catch (error) {
      console.error('Gemini health check failed:', error.message);
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

const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
  }

  /**
   * Generate a response from Ollama
   * @param {string} prompt - User's question/prompt
   * @param {string} systemPrompt - System instructions for the model
   * @param {boolean} stream - Whether to stream the response
   * @returns {Promise<string>} - Model's response
   */
  async generateResponse(prompt, systemPrompt = '', stream = false) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/generate`,
        {
          model: this.model,
          prompt: prompt,
          system: systemPrompt,
          stream: stream,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
          },
        },
        {
          timeout: 120000, // 2 minutes timeout
        }
      );

      if (stream) {
        return response.data;
      }

      return response.data.response;
    } catch (error) {
      console.error('Ollama API Error:', error.message);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  /**
   * Chat with context (for multi-turn conversations)
   * @param {Array} messages - Array of message objects with role and content
   * @param {string} systemPrompt - System instructions
   * @returns {Promise<string>} - Model's response
   */
  async chat(messages, systemPrompt = '') {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/chat`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          stream: false,
        },
        {
          timeout: 120000,
        }
      );

      return response.data.message.content;
    } catch (error) {
      console.error('Ollama Chat API Error:', error.message);
      throw new Error(`Failed to chat: ${error.message}`);
    }
  }

  /**
   * Check if Ollama service is available
   * @returns {Promise<boolean>}
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error('Ollama health check failed:', error.message);
      return false;
    }
  }

  /**
   * List available models
   * @returns {Promise<Array>}
   */
  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return response.data.models || [];
    } catch (error) {
      console.error('Failed to list models:', error.message);
      return [];
    }
  }
}

module.exports = new OllamaService();

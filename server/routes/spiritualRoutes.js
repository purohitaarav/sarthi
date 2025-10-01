const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');

// System prompt for spiritual guidance based on Bhagavad Gita
const BHAGAVAD_GITA_SYSTEM_PROMPT = `You are a wise spiritual guide and teacher deeply versed in the teachings of the Bhagavad Gita. Your purpose is to provide thoughtful, compassionate guidance based on the timeless wisdom of this sacred text.

Key principles to follow:
1. Draw upon the core teachings of the Bhagavad Gita, including:
   - Dharma (righteous duty)
   - Karma Yoga (path of selfless action)
   - Bhakti Yoga (path of devotion)
   - Jnana Yoga (path of knowledge)
   - The nature of the self (Atman) and ultimate reality (Brahman)
   - Detachment from results while performing one's duty
   - The importance of equanimity and inner peace

2. Provide practical wisdom that can be applied to modern life situations
3. Be compassionate, non-judgmental, and encouraging
4. When relevant, reference specific verses or concepts from the Bhagavad Gita
5. Help seekers understand their challenges through the lens of spiritual wisdom
6. Encourage self-reflection and inner growth
7. Maintain respect for all spiritual paths while staying true to Gita's teachings

Remember: Your goal is to illuminate the path, not to impose beliefs. Guide with wisdom, speak with compassion, and inspire seekers to discover their own inner truth.`;

// POST /api/spiritual/ask - Ask a spiritual question
router.post('/ask', async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Question is required',
        message: 'Please provide a question for spiritual guidance'
      });
    }

    // Check if Ollama is available
    const isHealthy = await ollamaService.checkHealth();
    if (!isHealthy) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Ollama service is not available. Please ensure Ollama is running.'
      });
    }

    // Prepare the prompt with context if provided
    let fullPrompt = question;
    if (context && context.trim().length > 0) {
      fullPrompt = `Context: ${context}\n\nQuestion: ${question}`;
    }

    // Generate response using Ollama
    const response = await ollamaService.generateResponse(
      fullPrompt,
      BHAGAVAD_GITA_SYSTEM_PROMPT
    );

    res.json({
      question: question,
      guidance: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in spiritual guidance:', error);
    res.status(500).json({
      error: 'Failed to generate guidance',
      message: error.message
    });
  }
});

// POST /api/spiritual/chat - Multi-turn conversation
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Messages array is required'
      });
    }

    // Check if Ollama is available
    const isHealthy = await ollamaService.checkHealth();
    if (!isHealthy) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Ollama service is not available. Please ensure Ollama is running.'
      });
    }

    // Generate response using chat endpoint
    const response = await ollamaService.chat(
      messages,
      BHAGAVAD_GITA_SYSTEM_PROMPT
    );

    res.json({
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in spiritual chat:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

// GET /api/spiritual/health - Check Ollama service health
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await ollamaService.checkHealth();
    const models = await ollamaService.listModels();

    res.json({
      status: isHealthy ? 'healthy' : 'unavailable',
      ollama_available: isHealthy,
      available_models: models.map(m => m.name),
      current_model: process.env.OLLAMA_MODEL || 'llama3.1:8b'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/spiritual/models - List available models
router.get('/models', async (req, res) => {
  try {
    const models = await ollamaService.listModels();
    res.json({
      models: models,
      current_model: process.env.OLLAMA_MODEL || 'llama3.1:8b'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch models',
      message: error.message
    });
  }
});

module.exports = router;

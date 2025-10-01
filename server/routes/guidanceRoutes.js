const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/turso');
const ollamaService = require('../services/ollamaService');

/**
 * Enhanced Spiritual Guidance Routes
 * Combines Turso database verse search with Ollama AI for contextual guidance
 */

// System prompt for spiritual guidance with verse context
const GUIDANCE_SYSTEM_PROMPT = `You are a compassionate spiritual guide deeply versed in the teachings of the Bhagavad Gita. 

Your role is to:
1. Provide thoughtful, empathetic spiritual guidance based on authentic Bhagavad Gita verses
2. Always cite the specific verses (chapter.verse format) you reference
3. Connect ancient wisdom to modern life situations
4. Be compassionate, non-judgmental, and encouraging
5. Help seekers understand their challenges through the lens of Gita's teachings
6. Explain Sanskrit terms when relevant
7. Provide practical advice rooted in spiritual principles

Remember: Guide with wisdom, speak with compassion, and always ground your advice in the verses provided.`;

/**
 * GET /api/guidance/verses?query=keyword
 * Search database for verses matching a keyword
 */
router.get('/verses', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required',
        message: 'Please provide a search query'
      });
    }

    const searchTerm = `%${query.trim()}%`;
    const limitNum = Math.min(parseInt(limit) || 10, 50); // Max 50 results

    // Search across Sanskrit text, translation, and purport
    const result = await executeQuery(`
      SELECT 
        v.id,
        v.chapter_id,
        v.verse_number,
        v.sanskrit_text,
        v.transliteration,
        v.word_meanings,
        v.translation_english,
        v.purport,
        c.chapter_number,
        c.title_english as chapter_title
      FROM verses v
      JOIN chapters c ON v.chapter_id = c.id
      WHERE 
        v.sanskrit_text LIKE ? OR
        v.transliteration LIKE ? OR
        v.translation_english LIKE ? OR
        v.purport LIKE ? OR
        v.word_meanings LIKE ?
      ORDER BY c.chapter_number, v.verse_number
      LIMIT ?
    `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limitNum]);

    res.json({
      success: true,
      query: query,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Error searching verses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search verses',
      message: error.message
    });
  }
});

/**
 * POST /api/guidance/ask
 * Provide AI-powered spiritual guidance based on relevant Gita verses
 * 
 * Request body:
 * {
 *   "query": "How to deal with anxiety?",
 *   "maxVerses": 5  // optional, default 5
 * }
 */
router.post('/ask', async (req, res) => {
  try {
    const { query, maxVerses = 5 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query is required',
        message: 'Please provide a question or topic for spiritual guidance'
      });
    }

    // Check if Ollama is available
    const isHealthy = await ollamaService.checkHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: 'AI service unavailable',
        message: 'Ollama service is not available. Please ensure Ollama is running.'
      });
    }

    // Step 1: Search for relevant verses
    const relevantVerses = await findRelevantVerses(query, maxVerses);

    if (relevantVerses.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No relevant verses found',
        message: 'Could not find verses related to your query. Try different keywords.'
      });
    }

    // Step 2: Construct prompt with verse context
    const verseContext = relevantVerses.map(v => 
      `[Bhagavad Gita ${v.chapter_number}.${v.verse_number}]\n` +
      `Sanskrit: ${v.sanskrit_text}\n` +
      `Translation: ${v.translation_english}\n` +
      `Purport: ${v.purport.substring(0, 300)}...`
    ).join('\n\n---\n\n');

    const fullPrompt = `Based on these Bhagavad Gita verses:\n\n${verseContext}\n\n` +
                      `User's question: "${query}"\n\n` +
                      `Please provide spiritual guidance that:\n` +
                      `1. Addresses the user's question directly\n` +
                      `2. References specific verses (use chapter.verse format)\n` +
                      `3. Explains how the Gita's wisdom applies to this situation\n` +
                      `4. Offers practical, compassionate advice\n` +
                      `5. Is empathetic and encouraging`;

    // Step 3: Generate AI response
    const guidance = await ollamaService.generateResponse(
      fullPrompt,
      GUIDANCE_SYSTEM_PROMPT
    );

    // Step 4: Return response with verses
    res.json({
      success: true,
      query: query,
      guidance: guidance,
      verses_referenced: relevantVerses.map(v => ({
        reference: `${v.chapter_number}.${v.verse_number}`,
        chapter_title: v.chapter_title,
        translation: v.translation_english
      })),
      verse_count: relevantVerses.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error providing guidance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate guidance',
      message: error.message
    });
  }
});

/**
 * POST /api/guidance/chat
 * Multi-turn conversation with verse-based context
 * 
 * Request body:
 * {
 *   "messages": [
 *     { "role": "user", "content": "What is dharma?" },
 *     { "role": "assistant", "content": "..." },
 *     { "role": "user", "content": "How do I practice it?" }
 *   ],
 *   "includeVerses": true  // optional, default true
 * }
 */
router.post('/chat', async (req, res) => {
  try {
    const { messages, includeVerses = true } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Messages array is required'
      });
    }

    // Check if Ollama is available
    const isHealthy = await ollamaService.checkHealth();
    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        error: 'AI service unavailable',
        message: 'Ollama service is not available.'
      });
    }

    // Get the last user message for verse search
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    let verseContext = '';
    let relevantVerses = [];

    if (includeVerses && lastUserMessage) {
      relevantVerses = await findRelevantVerses(lastUserMessage.content, 3);
      
      if (relevantVerses.length > 0) {
        verseContext = '\n\nRelevant Bhagavad Gita verses:\n' + 
          relevantVerses.map(v => 
            `[${v.chapter_number}.${v.verse_number}] ${v.translation_english}`
          ).join('\n');
      }
    }

    // Add verse context to the last message
    const enhancedMessages = [...messages];
    if (verseContext && enhancedMessages.length > 0) {
      const lastMsg = enhancedMessages[enhancedMessages.length - 1];
      lastMsg.content += verseContext;
    }

    // Generate response using chat endpoint
    const response = await ollamaService.chat(
      enhancedMessages,
      GUIDANCE_SYSTEM_PROMPT
    );

    res.json({
      success: true,
      response: response,
      verses_referenced: relevantVerses.map(v => ({
        reference: `${v.chapter_number}.${v.verse_number}`,
        translation: v.translation_english
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

/**
 * GET /api/guidance/topics
 * Get suggested topics and common questions
 */
router.get('/topics', async (req, res) => {
  try {
    const topics = [
      {
        topic: 'Dealing with Anxiety and Stress',
        keywords: ['anxiety', 'stress', 'worry', 'fear', 'peace'],
        sample_query: 'How can I find peace when dealing with anxiety?'
      },
      {
        topic: 'Understanding Duty and Purpose',
        keywords: ['dharma', 'duty', 'purpose', 'responsibility'],
        sample_query: 'What is my dharma and how do I fulfill it?'
      },
      {
        topic: 'Handling Loss and Grief',
        keywords: ['death', 'loss', 'grief', 'sorrow', 'mourning'],
        sample_query: 'How should I cope with the loss of a loved one?'
      },
      {
        topic: 'Overcoming Attachment',
        keywords: ['attachment', 'detachment', 'desire', 'letting go'],
        sample_query: 'How can I practice detachment without being cold?'
      },
      {
        topic: 'Finding Inner Strength',
        keywords: ['strength', 'courage', 'confidence', 'self-doubt'],
        sample_query: 'How do I find inner strength during difficult times?'
      },
      {
        topic: 'Karma and Action',
        keywords: ['karma', 'action', 'work', 'results', 'fruits'],
        sample_query: 'What does the Gita teach about karma and action?'
      },
      {
        topic: 'Self-Realization',
        keywords: ['self', 'atman', 'soul', 'consciousness', 'awareness'],
        sample_query: 'What is the true nature of the self?'
      },
      {
        topic: 'Devotion and Love',
        keywords: ['bhakti', 'devotion', 'love', 'surrender', 'faith'],
        sample_query: 'How can I develop devotion and love for the Divine?'
      }
    ];

    res.json({
      success: true,
      topics: topics,
      total: topics.length
    });

  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch topics',
      message: error.message
    });
  }
});

/**
 * Helper function to find relevant verses based on query
 * Uses keyword extraction and database search
 */
async function findRelevantVerses(query, maxResults = 5) {
  try {
    // Extract keywords from query (simple approach)
    const keywords = extractKeywords(query);
    
    // Build search query with multiple keywords
    const searchConditions = keywords.map(() => 
      '(v.translation_english LIKE ? OR v.purport LIKE ? OR v.word_meanings LIKE ?)'
    ).join(' OR ');

    const searchParams = keywords.flatMap(keyword => {
      const term = `%${keyword}%`;
      return [term, term, term];
    });

    searchParams.push(maxResults);

    const result = await executeQuery(`
      SELECT 
        v.id,
        v.chapter_id,
        v.verse_number,
        v.sanskrit_text,
        v.translation_english,
        v.purport,
        c.chapter_number,
        c.title_english as chapter_title
      FROM verses v
      JOIN chapters c ON v.chapter_id = c.id
      WHERE ${searchConditions}
      ORDER BY c.chapter_number, v.verse_number
      LIMIT ?
    `, searchParams);

    return result.rows;

  } catch (error) {
    console.error('Error finding relevant verses:', error);
    return [];
  }
}

/**
 * Extract keywords from user query
 * Simple implementation - can be enhanced with NLP
 */
function extractKeywords(query) {
  // Common stop words to filter out
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'can', 'may', 'might', 'must', 'shall', 'i', 'you', 'he', 'she',
    'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
    'to', 'from', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'as', 'of'
  ]);

  // Extract words, filter stop words, and get unique keywords
  const words = query.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Return unique keywords (max 5 for performance)
  return [...new Set(words)].slice(0, 5);
}

module.exports = router;

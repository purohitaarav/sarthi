const express = require('express');
const router = express.Router();
const cache = require('../cache'); // Static cache - no database!
const geminiService = require('../services/geminiService');

/* ===========================
   Constants & Timeouts
   =========================== */

const EMBEDDING_TIMEOUT_MS = 15000;
const GENERATION_TIMEOUT_MS = 60000;
const QUERY_PARSE_TIMEOUT_MS = 8000;
const DEFAULT_MAX_VERSES = 3;

/* ===========================
   Prompts
   =========================== */

const GUIDANCE_SYSTEM_PROMPT = `
Summarize and explain ONLY the teachings found in the verses provided.

Rules:
- Cite verses as chapter.verse
- Do not add new interpretations
- Be concise and neutral
`.trim();

const QUERY_PARSER_SYSTEM_PROMPT = `
Parse the user query into JSON.

{
  "concepts": string[],
  "relations": string[],
  "targets": string[],
  "intent": "definition" | "causal" | "explanation" | "comparison" | "instruction"
}

Return JSON only.
`.trim();

/* ===========================
   Utilities
   =========================== */

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out`)), ms)
    )
  ]);
}

function blobToFloat32Array(blob) {
  // Embeddings from JSON are already arrays
  if (Array.isArray(blob)) return new Float32Array(blob);

  const buf = Buffer.isBuffer(blob) ? blob : Buffer.from(blob);
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}

function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function extractKeywords(q) {
  return q.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length >= 4);
}

/* ===========================
   Query Parsing
   =========================== */

async function parseQueryWithLLM(query) {
  try {
    const raw = await withTimeout(
      geminiService.generateResponse(`Analyze: "${query}"`, QUERY_PARSER_SYSTEM_PROMPT),
      QUERY_PARSE_TIMEOUT_MS,
      'Query parser'
    );
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

/* ===========================
   Static Cache (Instant Access)
   =========================== */

// Load all data from static JSON files (instant, synchronous)
const allVerses = cache.getVerses();
const allEmbeddings = cache.getEmbeddings();

console.log(`✅ Static cache loaded: ${allVerses.length} verses, ${allEmbeddings.length} embeddings`);

// Create maps for quick lookup
const versesMap = new Map(allVerses.map(v => [v.verse_id, v]));
const embeddingsArray = allEmbeddings.map(e => ({
  verse_id: e.verse_id,
  vector: blobToFloat32Array(e.embedding)
}));

/* ===========================
   Search
   =========================== */

async function performHybridSearch(query, maxResults) {
  const searchStart = Date.now();

  console.log(`[Search] Using static cache: ${embeddingsArray.length} embeddings, ${versesMap.size} verses`);

  console.log('[Search] Running LLM tasks (query parsing + embedding)...');
  const [parsedQuery, embedding] = await Promise.all([
    parseQueryWithLLM(query),
    withTimeout(
      geminiService.generateEmbedding(query),
      EMBEDDING_TIMEOUT_MS,
      'Embedding generation'
    ).catch(err => {
      console.warn('[Search] Embedding generation failed:', err.message);
      return null;
    })
  ]);
  console.log(`[Search] LLM tasks complete (${Date.now() - searchStart}ms)`);

  const keywords = extractKeywords(query);

  const scored = embeddingsArray.map(e => {
    const verse = versesMap.get(e.verse_id);
    if (!verse) return null;

    const semantic = embedding
      ? cosineSimilarity(new Float32Array(embedding), e.vector)
      : 0;

    const text = `${verse.translation} ${verse.commentary || ''}`.toLowerCase();
    const lexical = keywords.reduce((s, k) => s + (text.includes(k) ? 1 : 0), 0);

    return { verse, score: semantic * 2 + lexical };
  }).filter(Boolean);

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(r => r.verse);
}

/* ===========================
   Route
   =========================== */

router.post('/ask', async (req, res) => {
  const startedAt = Date.now();
  const requestId = req.id || Math.random().toString(36).substring(7);
  let guidance = '';

  try {
    const { query, maxVerses = DEFAULT_MAX_VERSES } = req.body || {};
    if (!query) return res.status(400).json({ error: 'Query required' });

    console.log(`[${requestId}] [STEP 1] Starting request - Query: "${query.substring(0, 50)}..."`);

    console.log(`[${requestId}] [STEP 2] Retrieving verses via hybrid search...`);
    const verses = await performHybridSearch(query, maxVerses);
    console.log(`[${requestId}] [STEP 2 DONE] Found ${verses.length} verses (${Date.now() - startedAt}ms elapsed)`);

    if (!verses.length) {
      return res.status(404).json({ error: 'No verses found' });
    }

    console.log(`[${requestId}] [STEP 3] Building verse context...`);
    const verseContext = verses.map(v => `
[BHAGAVAD GITA ${v.chapter}.${v.verse_number}]
${v.translation}
${v.commentary || ''}
    `.trim()).join('\n\n---\n\n');
    console.log(`[${requestId}] [STEP 3 DONE] Context built (${Date.now() - startedAt}ms elapsed)`);

    const prompt = `Verses:\n${verseContext}\n\nQuestion: ${query}`;

    console.log(`[${requestId}] [STEP 4] Calling Gemini for response generation (timeout: ${GENERATION_TIMEOUT_MS}ms)...`);
    try {
      guidance = await withTimeout(
        geminiService.generateResponse(prompt, GUIDANCE_SYSTEM_PROMPT),
        GENERATION_TIMEOUT_MS,
        'Response generation'
      );
      console.log(`[${requestId}] [STEP 4 DONE] Gemini response received (${Date.now() - startedAt}ms elapsed)`);
    } catch (genErr) {
      console.error(`[${requestId}] [STEP 4 ERROR] Gemini generation failed: ${genErr.message} (${Date.now() - startedAt}ms elapsed)`);

      // Fallback response
      guidance = "I found relevant verses for your question, but I'm having trouble generating a detailed response right now. Please review the verses below for guidance.";
    }

    console.log(`[${requestId}] [STEP 5] Sending response (total: ${Date.now() - startedAt}ms)`);
    return res.json({
      success: true,
      latency_ms: Date.now() - startedAt,
      guidance,
      verses_referenced: verses.map(v => ({
        reference: `${v.chapter}.${v.verse_number}`,
        translation: v.translation,
        purport: v.commentary
      }))
    });

  } catch (err) {
    console.error(`[${requestId}] ❌ /ask failed at ${Date.now() - startedAt}ms:`, err.message);
    console.error(`[${requestId}] Stack:`, err.stack);
    return res.status(500).json({
      error: 'Internal error',
      latency_ms: Date.now() - startedAt
    });
  }
});

module.exports = { router };

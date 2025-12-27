const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/turso');
const geminiService = require('../services/geminiService');

/* ===========================
   Constants & Timeouts
   =========================== */

const EMBEDDING_TIMEOUT_MS = 15000;
const GENERATION_TIMEOUT_MS = 60000;
const DB_TIMEOUT_MS = 10000;
const QUERY_PARSE_TIMEOUT_MS = 8000;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MAX_VERSES = 3;

const MAX_CACHE_ROWS = 300;

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
   Caches (LAZY LOADING WITH RETRY)
   =========================== */

let embeddingsCache = null;
let versesCache = null;
let embeddingsLoadingPromise = null;
let versesLoadingPromise = null;

async function getEmbeddingsCache() {
  if (embeddingsCache) return embeddingsCache;
  if (embeddingsLoadingPromise) return embeddingsLoadingPromise;

  embeddingsLoadingPromise = (async () => {
    console.log(`[Cache] 🔄 Loading embeddings (attempt 1) at ${new Date().toISOString()}...`);

    try {
      // First attempt - no timeout, let it complete naturally
      const embRes = await executeQuery(
        'SELECT verse_id, embedding FROM verse_embeddings LIMIT ?',
        [MAX_CACHE_ROWS]
      );

      embeddingsCache = embRes.rows.map(r => ({
        verse_id: r.verse_id,
        vector: blobToFloat32Array(r.embedding)
      }));

      console.log(`✅ Cache loaded: ${embeddingsCache.length} embeddings at ${new Date().toISOString()}`);
      return embeddingsCache;

    } catch (err) {
      console.error(`[Cache] ❌ Attempt 1 failed: ${err.message}`);
      console.log('[Cache] 🔄 Retrying in 5 seconds...');

      // Wait 5 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 5000));

      try {
        console.log(`[Cache] 🔄 Loading embeddings (attempt 2) at ${new Date().toISOString()}...`);
        const embRes = await executeQuery(
          'SELECT verse_id, embedding FROM verse_embeddings LIMIT ?',
          [MAX_CACHE_ROWS]
        );

        embeddingsCache = embRes.rows.map(r => ({
          verse_id: r.verse_id,
          vector: blobToFloat32Array(r.embedding)
        }));

        console.log(`✅ Cache loaded: ${embeddingsCache.length} embeddings at ${new Date().toISOString()} (retry succeeded)`);
        return embeddingsCache;

      } catch (retryErr) {
        console.error(`[Cache] ❌❌ BOTH ATTEMPTS FAILED`);
        console.error(`[Cache] Error details: ${retryErr.message}`);
        console.error(`[Cache] Stack: ${retryErr.stack}`);
        embeddingsLoadingPromise = null; // Allow future retries
        throw retryErr;
      }
    }
  })();

  return embeddingsLoadingPromise;
}

async function getVersesCache() {
  if (versesCache) return versesCache;
  if (versesLoadingPromise) return versesLoadingPromise;

  versesLoadingPromise = (async () => {
    console.log(`[Cache] 🔄 Loading verses (attempt 1) at ${new Date().toISOString()}...`);

    try {
      // First attempt - no timeout, let it complete naturally
      const verseRes = await executeQuery(`
        SELECT v.id, v.verse_number, v.translation_english, v.purport, c.chapter_number
        FROM verses v
        JOIN chapters c ON v.chapter_id = c.id
        LIMIT ${MAX_CACHE_ROWS}
      `);

      versesCache = new Map(verseRes.rows.map(v => [v.id, v]));

      console.log(`✅ Cache loaded: ${versesCache.size} verses at ${new Date().toISOString()}`);
      return versesCache;

    } catch (err) {
      console.error(`[Cache] ❌ Attempt 1 failed: ${err.message}`);
      console.log('[Cache] 🔄 Retrying in 5 seconds...');

      // Wait 5 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 5000));

      try {
        console.log(`[Cache] 🔄 Loading verses (attempt 2) at ${new Date().toISOString()}...`);
        const verseRes = await executeQuery(`
          SELECT v.id, v.verse_number, v.translation_english, v.purport, c.chapter_number
          FROM verses v
          JOIN chapters c ON v.chapter_id = c.id
          LIMIT ${MAX_CACHE_ROWS}
        `);

        versesCache = new Map(verseRes.rows.map(v => [v.id, v]));

        console.log(`✅ Cache loaded: ${versesCache.size} verses at ${new Date().toISOString()} (retry succeeded)`);
        return versesCache;

      } catch (retryErr) {
        console.error(`[Cache] ❌❌ BOTH ATTEMPTS FAILED`);
        console.error(`[Cache] Error details: ${retryErr.message}`);
        console.error(`[Cache] Stack: ${retryErr.stack}`);
        versesLoadingPromise = null; // Allow future retries
        throw retryErr;
      }
    }
  })();

  return versesLoadingPromise;
}

// Background initialization function (non-blocking)
function initializeCache() {
  console.log('[Cache] Starting background initialization...');
  Promise.all([
    getEmbeddingsCache().catch(err => console.error('[Cache] Embeddings init failed:', err.message)),
    getVersesCache().catch(err => console.error('[Cache] Verses init failed:', err.message))
  ]).then(() => {
    console.log('[Cache] 🎉 Background initialization complete');
  });
}

/* ===========================
   Search
   =========================== */

async function performHybridSearch(query, maxResults) {
  const searchStart = Date.now();

  console.log('[Search] [SUBSTEP 2.1] Retrieving embeddings cache...');

  // Add 10-second timeout for cache loading - fail fast if cache isn't ready
  const cacheTimeout = 10000;
  let embeddings, verses;

  try {
    embeddings = await Promise.race([
      getEmbeddingsCache(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Cache loading timeout - embeddings not ready after 10s')), cacheTimeout)
      )
    ]);
    console.log(`[Search] [SUBSTEP 2.1 DONE] Got ${embeddings.length} embeddings (${Date.now() - searchStart}ms)`);
  } catch (err) {
    console.error(`[Search] ❌ Cache timeout: ${err.message}`);
    throw new Error('Service temporarily unavailable - cache still loading. Please try again in 30 seconds.');
  }

  console.log('[Search] [SUBSTEP 2.2] Retrieving verses cache...');
  try {
    verses = await Promise.race([
      getVersesCache(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Cache loading timeout - verses not ready after 10s')), cacheTimeout)
      )
    ]);
    console.log(`[Search] [SUBSTEP 2.2 DONE] Got ${verses.size} verses (${Date.now() - searchStart}ms)`);
  } catch (err) {
    console.error(`[Search] ❌ Cache timeout: ${err.message}`);
    throw new Error('Service temporarily unavailable - cache still loading. Please try again in 30 seconds.');
  }

  console.log('[Search] [SUBSTEP 2.3] Running parallel LLM tasks (query parsing + embedding)...');
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
  console.log(`[Search] [SUBSTEP 2.3 DONE] LLM tasks complete (${Date.now() - searchStart}ms)`);

  const keywords = extractKeywords(query);

  const scored = embeddings.map(e => {
    const verse = verses.get(e.verse_id);
    if (!verse) return null;

    const semantic = embedding
      ? cosineSimilarity(new Float32Array(embedding), e.vector)
      : 0;

    const text = `${verse.translation_english} ${verse.purport || ''}`.toLowerCase();
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
    console.log(`[${requestId}] [STEP 1.1] Cache status - Embeddings: ${!!embeddingsCache}, Verses: ${!!versesCache}`);
    if (embeddingsCache) console.log(`[${requestId}] [STEP 1.2] Cache size - Embeddings: ${embeddingsCache.length}`);
    if (versesCache) console.log(`[${requestId}] [STEP 1.3] Cache size - Verses: ${versesCache.size}`);

    console.log(`[${requestId}] [STEP 2] Retrieving verses via hybrid search...`);
    const verses = await performHybridSearch(query, maxVerses);
    console.log(`[${requestId}] [STEP 2 DONE] Found ${verses.length} verses (${Date.now() - startedAt}ms elapsed)`);

    if (!verses.length) {
      return res.status(404).json({ error: 'No verses found' });
    }

    console.log(`[${requestId}] [STEP 3] Building verse context...`);
    const verseContext = verses.map(v => `
[BHAGAVAD GITA ${v.chapter_number}.${v.verse_number}]
${v.translation_english}
${v.purport || ''}
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
        reference: `${v.chapter_number}.${v.verse_number}`,
        translation: v.translation_english,
        purport: v.purport
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

module.exports = { router, initializeCache };


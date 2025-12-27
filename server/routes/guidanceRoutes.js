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
   Caches (SAFE, BOUNDED)
   =========================== */

let embeddingsCache = null;
let versesCache = null;

async function preload() {
  console.log('[Preload] Starting data preloading...');
  try {
    const [embRes, verseRes] = await Promise.all([
      withTimeout(
        executeQuery('SELECT verse_id, embedding FROM verse_embeddings LIMIT ?', [MAX_CACHE_ROWS]),
        DB_TIMEOUT_MS,
        'Embeddings preload'
      ),
      withTimeout(
        executeQuery(`
          SELECT v.id, v.verse_number, v.translation_english, v.purport, c.chapter_number
          FROM verses v
          JOIN chapters c ON v.chapter_id = c.id
          LIMIT ${MAX_CACHE_ROWS}
        `),
        DB_TIMEOUT_MS,
        'Verses preload'
      )
    ]);

    embeddingsCache = embRes.rows.map(r => ({
      verse_id: r.verse_id,
      vector: blobToFloat32Array(r.embedding)
    }));

    versesCache = new Map(verseRes.rows.map(v => [v.id, v]));

    console.log(`[Preload] Successfully loaded ${embeddingsCache.length} embeddings and ${versesCache.size} verses.`);
  } catch (err) {
    console.error('[Preload] Failed to preload data:', err.message);
    throw err; // Critical failure
  }
}

function getEmbeddingsCache() {
  if (!embeddingsCache) throw new Error('Embeddings cache not preloaded');
  return embeddingsCache;
}

function getVersesCache() {
  if (!versesCache) throw new Error('Verses cache not preloaded');
  return versesCache;
}

/* ===========================
   Search
   =========================== */

async function performHybridSearch(query, maxResults) {
  console.log('[Search] Loading caches');
  const embeddings = getEmbeddingsCache();
  const verses = getVersesCache();

  console.log('[Search] Running LLM tasks');
  const [parsedQuery, embedding] = await Promise.all([
    parseQueryWithLLM(query),
    withTimeout(
      geminiService.generateEmbedding(query),
      EMBEDDING_TIMEOUT_MS,
      'Embedding generation'
    ).catch(() => null)
  ]);

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
  let guidance = '';

  try {
    const { query, maxVerses = DEFAULT_MAX_VERSES } = req.body || {};
    if (!query) return res.status(400).json({ error: 'Query required' });

    console.log('🔍 Retrieving verses...');
    const verses = await performHybridSearch(query, maxVerses);

    if (!verses.length) {
      return res.status(404).json({ error: 'No verses found' });
    }

    const verseContext = verses.map(v => `
[BHAGAVAD GITA ${v.chapter_number}.${v.verse_number}]
${v.translation_english}
${v.purport || ''}
    `.trim()).join('\n\n---\n\n');

    const prompt = `Verses:\n${verseContext}\n\nQuestion: ${query}`;

    guidance = await withTimeout(
      geminiService.generateResponse(prompt, GUIDANCE_SYSTEM_PROMPT),
      GENERATION_TIMEOUT_MS,
      'Response generation'
    );

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
    console.error('❌ /ask failed:', err.message);
    return res.status(500).json({
      error: 'Internal error',
      latency_ms: Date.now() - startedAt
    });
  }
});

module.exports = { router, preload };

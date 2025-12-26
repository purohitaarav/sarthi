const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/turso');
const geminiService = require('../services/geminiService');

/* ===========================
   Constants & Timeouts
   =========================== */

const HEALTH_TIMEOUT_MS = 3000;
const EMBEDDING_TIMEOUT_MS = 12000;
const GENERATION_TIMEOUT_MS = 90000;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_MAX_VERSES = 3;

const MIN_RECALL = 30;
const MAX_RECALL = 120;

/* ===========================
   System Prompt
   =========================== */

const GUIDANCE_SYSTEM_PROMPT = `
You are a compassionate spiritual guide deeply versed in the teachings of the Bhagavad Gita.

Your role is to:
1. Summarize and explain ONLY the teachings found in the verses provided.
2. Always cite the specific verses you reference using chapter.verse format.
3. Briefly connect the verse teachings to the user’s situation without adding new interpretations.
4. Maintain a compassionate, calm, and non-judgmental tone.
5. Explain Sanskrit terms only when they appear in the verses and only in one short sentence.
6. Offer practical takeaways ONLY if they are directly stated or clearly implied by the verses.

Constraints:
- Do NOT introduce ideas, advice, or interpretations not present in the provided verses.
- Do NOT elaborate beyond what is necessary to explain the verse meaning.
- Keep the response concise and focused.
- Avoid motivational language, storytelling, or philosophical expansion.

Always ground your response strictly in the verses provided.
`.trim();

const QUERY_PARSER_SYSTEM_PROMPT = `
You are a precise linguistic analyzer. Your task is to parse the user's query into a structured JSON object.
Do NOT answer the question. Only analyze its structure.

Output strictly valid JSON in this format:
{
  "concepts": string[],  // Core semantic concepts (e.g., "cycle of birth and death", "detachment")
  "relations": string[], // Relational or action phrases (e.g., "leads to", "destroys")
  "targets": string[],   // Specific entities or outcomes (e.g., "peace", "liberation")
  "intent": "definition" | "causal" | "explanation" | "comparison" | "instruction"
}

Rules:
1. Extract multi-word concepts as single strings where appropriate.
2. Exclude stopwords, operator words, and filler text from "concepts".
3. "intent" must be one of the specified enum values.
4. If a query is ambiguous, infer the most likely intent.
`.trim();

/* ===========================
   Timeout Wrapper
   =========================== */

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    )
  ]);
}

/* ===========================
   Embedding Helpers
   =========================== */

function blobToFloat32Array(blob) {
  if (!blob) return null;

  let buf;
  if (Buffer.isBuffer(blob)) buf = blob;
  else if (blob instanceof Uint8Array || blob instanceof ArrayBuffer) buf = Buffer.from(blob);
  else if (typeof blob === 'string') buf = Buffer.from(blob, 'base64');
  else throw new Error(`Unsupported embedding type: ${typeof blob}`);

  if (buf.byteLength % 4 !== 0) {
    throw new Error(`Invalid embedding byte length: ${buf.byteLength}`);
  }

  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}

/* ===========================
   Similarity
   =========================== */

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  let dot = 0;
  let na = 0;
  let nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

/* ===========================
   Keyword & Lexical Scoring
   =========================== */

function extractKeywords(query) {
  return query
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length >= 4);
}

async function parseQueryWithLLM(query) {
  try {
    const rawJSON = await geminiService.generateResponse(
      `Analyze this query: "${query}"`,
      QUERY_PARSER_SYSTEM_PROMPT
    );

    // Attempt to clean markdown code blocks if present
    const cleaned = rawJSON.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Query parsing failed, falling back to simple keywords:', err.message);
    return null;
  }
}

function lexicalScore(verse, parsedQuery, simpleKeywords) {
  const text = (
    (verse.translation_english || '') +
    ' ' +
    (verse.purport || '')
  ).toLowerCase();

  let score = 0;

  // 1. Heavy weight for Concepts
  if (parsedQuery && parsedQuery.concepts) {
    for (const concept of parsedQuery.concepts) {
      if (text.includes(concept.toLowerCase())) score += 3.0;
    }
  }

  // 2. Medium weight for Targets
  if (parsedQuery && parsedQuery.targets) {
    for (const target of parsedQuery.targets) {
      if (text.includes(target.toLowerCase())) score += 2.0;
    }
  }

  // 3. Low/Influencing weight for Relations (only if concepts also match?)
  // Prompt: "Relation phrases must influence ranking logic but must NOT be treated as keywords"
  if (parsedQuery && parsedQuery.relations) {
    for (const rel of parsedQuery.relations) {
      if (text.includes(rel.toLowerCase())) score += 0.5;
    }
  }

  // Fallback to simple keywords if parser failed or returned empty
  if (!parsedQuery || (!parsedQuery.concepts?.length && !parsedQuery.targets?.length)) {
    for (const k of simpleKeywords) {
      if (text.includes(k)) score += 1.0;
    }
  }

  return score;
}

/* ===========================
   In-Memory Embedding Cache
   =========================== */

let embeddingsCache = null;
let embeddingsCacheTime = 0;
let embeddingsCacheLoading = null;

async function getEmbeddingsCache() {
  const fresh = embeddingsCache && (Date.now() - embeddingsCacheTime < CACHE_TTL_MS);
  if (fresh) return embeddingsCache;

  if (embeddingsCacheLoading) return embeddingsCacheLoading;

  embeddingsCacheLoading = (async () => {
    const res = await executeQuery('SELECT verse_id, embedding FROM verse_embeddings');

    const parsed = [];
    for (const r of res.rows || []) {
      try {
        const vec = blobToFloat32Array(r.embedding);
        if (vec) parsed.push({ verse_id: r.verse_id, vector: vec });
      } catch (e) {
        console.warn(`Bad embedding for verse_id=${r.verse_id}: ${e.message}`);
      }
    }

    embeddingsCache = parsed;
    embeddingsCacheTime = Date.now();
    embeddingsCacheLoading = null;

    console.log(`🧠 Cached ${embeddingsCache.length} verse embeddings`);
    return embeddingsCache;
  })();

  return embeddingsCacheLoading;
}

/* ===========================
   Semantic + Lexical Search
   =========================== */

function computeRecallLimit(maxResults, query) {
  if (query.split(' ').length <= 4) return MAX_RECALL;
  const desired = Math.max(MIN_RECALL, maxResults * 10);
  return Math.min(MAX_RECALL, desired);
}

async function performHybridSearch(query, maxResults) {
  const recallLimit = computeRecallLimit(maxResults, query);
  const simpleKeywords = extractKeywords(query);

  // Parallel: Parse Intent + Generate Embedding
  const [parsedQuery, embedding] = await Promise.all([
    parseQueryWithLLM(query),
    withTimeout(
      geminiService.generateEmbedding(query),
      EMBEDDING_TIMEOUT_MS,
      'Embedding generation'
    )
  ]);

  if (!Array.isArray(embedding) || embedding.length === 0) return [];

  const queryVec = new Float32Array(embedding);
  const cached = await getEmbeddingsCache();
  if (!cached.length) return [];

  const ids = cached.map(c => c.verse_id);
  const placeholders = ids.map(() => '?').join(',');

  const versesRes = await executeQuery(
    `
    SELECT
      v.id,
      v.chapter_id,
      v.verse_number,
      v.sanskrit_text,
      v.translation_english,
      v.purport,
      c.chapter_number,
      c.title_english AS chapter_title
    FROM verses v
    JOIN chapters c ON v.chapter_id = c.id
    WHERE v.id IN (${placeholders})
    `,
    ids
  );

  const verseById = new Map((versesRes.rows || []).map(v => [v.id, v]));

  const ranked = cached
    .map(item => {
      const verse = verseById.get(item.verse_id);
      if (!verse) return null;

      const semantic = cosineSimilarity(queryVec, item.vector);
      const lexical = lexicalScore(verse, parsedQuery, simpleKeywords);

      // Boost semantic score based on intent?
      // For now, keep semantic as base. Lexical adds on top.
      return {
        verse,
        score: (lexical * 1.5) + (semantic * 2.0), // Tuned weights
        lexical,
        semantic
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, recallLimit);

  return ranked.slice(0, maxResults).map(r => r.verse);
}

/* ===========================
   Route
   =========================== */

router.post('/ask', async (req, res) => {
  const startedAt = Date.now();

  try {
    const { query, context, maxVerses = DEFAULT_MAX_VERSES } = req.body || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const healthy = await withTimeout(
      geminiService.checkHealth(),
      HEALTH_TIMEOUT_MS,
      'Gemini health check'
    );

    if (!healthy) {
      return res.status(503).json({ success: false, error: 'Gemini unavailable' });
    }

    console.log('🔍 Retrieving verses...');
    const verses = await performHybridSearch(
      query,
      Math.max(1, Math.min(10, maxVerses))
    );

    if (!verses.length) {
      return res.status(404).json({ success: false, error: 'No verses found' });
    }

    const verseContext = verses
      .map(v => `
[BHAGAVAD GITA ${v.chapter_number}.${v.verse_number}]
Translation: ${v.translation_english}
Purport: ${v.purport || ''}
      `.trim())
      .join('\n\n---\n\n');

    const finalPrompt =
      `Verses:\n${verseContext}\n\n` +
      (context ? `Context: ${context}\n\n` : '') +
      `User question: ${query}`;

    console.log('🧠 Generating guidance...');
    const guidance = await withTimeout(
      geminiService.generateResponse(finalPrompt, GUIDANCE_SYSTEM_PROMPT),
      GENERATION_TIMEOUT_MS,
      'LLM generation'
    );

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - startedAt,
      query,
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
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - startedAt
    });
  }
});

module.exports = router;

/**
 * Static data cache - loads verses and embeddings from JSON files
 * No database, no async, instant memory load
 */

const fs = require('fs');
const path = require('path');

// Load data synchronously on module import
const VERSES_PATH = path.join(__dirname, 'data/verses.json');
const EMBEDDINGS_PATH = path.join(__dirname, 'data/embeddings.json');

let versesData = [];
let embeddingsData = [];
let versesMap = new Map();
let embeddingsMap = new Map();

// Load verses
try {
    if (fs.existsSync(VERSES_PATH)) {
        const rawVerses = fs.readFileSync(VERSES_PATH, 'utf-8');
        versesData = JSON.parse(rawVerses);

        // Create a map for quick lookup by verse_id
        versesData.forEach(verse => {
            versesMap.set(verse.verse_id, verse);
        });

        console.log(`✅ Loaded ${versesData.length} verses from static JSON`);
    } else {
        console.warn(`⚠️  Verses file not found: ${VERSES_PATH}`);
    }
} catch (error) {
    console.error('❌ Failed to load verses:', error.message);
}

// Load embeddings
try {
    if (fs.existsSync(EMBEDDINGS_PATH)) {
        const rawEmbeddings = fs.readFileSync(EMBEDDINGS_PATH, 'utf-8');
        embeddingsData = JSON.parse(rawEmbeddings);

        // Create a map for quick lookup by verse_id
        embeddingsData.forEach(emb => {
            embeddingsMap.set(emb.verse_id, emb.embedding);
        });

        console.log(`✅ Loaded ${embeddingsData.length} embeddings from static JSON`);
    } else {
        console.warn(`⚠️  Embeddings file not found: ${EMBEDDINGS_PATH}`);
    }
} catch (error) {
    console.error('❌ Failed to load embeddings:', error.message);
}

/**
 * Get all verses
 * @returns {Array} Array of verse objects
 */
function getVerses() {
    return versesData;
}

/**
 * Get a specific verse by ID
 * @param {string} verseId - e.g., "1.1", "2.15"
 * @returns {Object|null} Verse object or null if not found
 */
function getVerse(verseId) {
    return versesMap.get(verseId) || null;
}

/**
 * Get verses by chapter
 * @param {number} chapterNumber - Chapter number (1-18)
 * @returns {Array} Array of verses in that chapter
 */
function getVersesByChapter(chapterNumber) {
    return versesData.filter(v => v.chapter === chapterNumber);
}

/**
 * Get all embeddings
 * @returns {Array} Array of {verse_id, embedding} objects
 */
function getEmbeddings() {
    return embeddingsData;
}

/**
 * Get embedding for a specific verse
 * @param {string} verseId - e.g., "1.1", "2.15"
 * @returns {Array|null} Embedding array or null if not found
 */
function getEmbedding(verseId) {
    return embeddingsMap.get(verseId) || null;
}

/**
 * Search verses by text (simple substring search)
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results
 * @returns {Array} Array of matching verses
 */
function searchVerses(query, maxResults = 10) {
    const lowerQuery = query.toLowerCase();

    return versesData
        .filter(v => {
            const text = `${v.translation} ${v.commentary}`.toLowerCase();
            return text.includes(lowerQuery);
        })
        .slice(0, maxResults);
}

/**
 * Get cache statistics
 * @returns {Object} Statistics about loaded data
 */
function getStats() {
    return {
        totalVerses: versesData.length,
        totalEmbeddings: embeddingsData.length,
        chapters: Array.from(new Set(versesData.map(v => v.chapter))).sort((a, b) => a - b),
        dataLoaded: versesData.length > 0 && embeddingsData.length > 0,
        versesPath: VERSES_PATH,
        embeddingsPath: EMBEDDINGS_PATH
    };
}

module.exports = {
    getVerses,
    getVerse,
    getVersesByChapter,
    getEmbeddings,
    getEmbedding,
    searchVerses,
    getStats
};

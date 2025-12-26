const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { initializeTurso, closeTurso, executeQuery } = require('../config/turso');

async function setupEmbeddings() {
    try {
        console.log('🔌 Connecting to database...');
        initializeTurso();

        console.log('📦 Creating verse_embeddings table...');

        // Create table for embeddings
        // specific vector type F32_BLOB is used for Turso/libSQL vector support
        await executeQuery(`
      CREATE TABLE IF NOT EXISTS verse_embeddings (
        verse_id INTEGER PRIMARY KEY,
        embedding F32_BLOB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(verse_id) REFERENCES verses(id) ON DELETE CASCADE
      )
    `);

        // Create vector index
        // Note: Vector index creation syntax might differ slightly based on libSQL version,
        // but this is the standard syntax for recent versions
        try {
            await executeQuery(`
        CREATE INDEX IF NOT EXISTS idx_verse_embeddings_embedding 
        ON verse_embeddings(libsql_vector_idx(embedding))
      `);
            console.log('✅ Vector index created');
        } catch (idxError) {
            console.warn('⚠️  Could not create vector index (might be already present or not supported in this version):', idxError.message);
        }

        console.log('✅ Embeddings table setup complete');
    } catch (error) {
        console.error('❌ Error setting up embeddings:', error);
        process.exit(1);
    } finally {
        await closeTurso();
    }
}

// Run setup if executed directly
if (require.main === module) {
    setupEmbeddings();
}

module.exports = setupEmbeddings;

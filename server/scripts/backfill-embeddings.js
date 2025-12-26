const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { initializeTurso, closeTurso, executeQuery } = require('../config/turso');
const geminiService = require('../services/geminiService');

async function backfillEmbeddings() {
    try {
        console.log('🔌 Connecting to services...');
        initializeTurso();

        // Check Health
        const isHealthy = await geminiService.checkHealth();
        if (!isHealthy) {
            console.warn('⚠️ Health check failed or timed out. Attempting to proceed anyway...');
        }

        console.log('Testing DB connection...');
        await executeQuery('SELECT 1');
        console.log('✅ DB connection OK');

        // Count verses
        const countRes = await executeQuery('SELECT COUNT(*) AS c FROM verses');
        const totalVerses = countRes.rows[0].c;
        console.log(`📖 Total verses in DB: ${totalVerses}`);

        const BATCH_SIZE = 10;

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (let offset = 0; offset < totalVerses; offset += BATCH_SIZE) {
            console.log(`\n➡️  Processing verses ${offset} – ${offset + BATCH_SIZE}`);

            // IMPORTANT: fetch purport explicitly
            const result = await executeQuery(
                `
        SELECT
          id,
          chapter_id,
          verse_number,
          translation_english,
          purport
        FROM verses
        LIMIT ? OFFSET ?
        `,
                [BATCH_SIZE, offset]
            );

            for (const verse of result.rows) {
                // Delete existing embedding to force update (since we switched models)
                await executeQuery('DELETE FROM verse_embeddings WHERE verse_id = ?', [verse.id]);

                try {
                    console.log(
                        `🔹 Embedding Bhagavad Gita ${verse.chapter_id}.${verse.verse_number} (ID ${verse.id})`
                    );

                    // Structured, consistent embedding text
                    const embeddingText = `
Bhagavad Gita ${verse.chapter_id}.${verse.verse_number}

Translation:
${verse.translation_english}

Purport:
${verse.purport || ''}
          `.trim();

                    const embedding = await geminiService.generateEmbedding(embeddingText);

                    if (!Array.isArray(embedding) || embedding.length === 0) {
                        throw new Error('Empty embedding returned');
                    }

                    const float32 = new Float32Array(embedding);
                    const buffer = Buffer.from(float32.buffer);

                    await executeQuery(
                        'INSERT INTO verse_embeddings (verse_id, embedding) VALUES (?, ?)',
                        [verse.id, buffer]
                    );

                    successCount++;
                } catch (err) {
                    console.error(`❌ Error embedding verse ID ${verse.id}: ${err.message}`);
                    errorCount++;
                }
            }
        }

        console.log('\n==============================');
        console.log('✅ Embedding backfill complete');
        console.log(`✔️  Inserted: ${successCount}`);
        console.log(`⏭️  Skipped: ${skipCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log('==============================\n');

    } catch (fatal) {
        console.error('\n❌ Fatal error during backfill:', fatal);
    } finally {
        await closeTurso();
        console.log('🔌 Turso connection closed');
    }
}

if (require.main === module) {
    backfillEmbeddings();
}

module.exports = backfillEmbeddings;

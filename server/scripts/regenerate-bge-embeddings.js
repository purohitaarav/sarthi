const fs = require('fs');
const path = require('path');
const geminiService = require('../services/geminiService');

const VERSES_PATH = path.join(__dirname, '../data/verses.json');
const EMBEDDINGS_PATH = path.join(__dirname, '../data/embeddings.json');

async function main() {
    try {
        console.log('═'.repeat(60));
        console.log('  REGENERATING STATIC BGE EMBEDDINGS');
        console.log('═'.repeat(60));

        if (!fs.existsSync(VERSES_PATH)) {
            console.error(`❌ Verses file not found at ${VERSES_PATH}`);
            process.exit(1);
        }

        const verses = JSON.parse(fs.readFileSync(VERSES_PATH, 'utf-8'));
        console.log(`📖 Loaded ${verses.length} verses from verses.json`);

        console.log('🔮 Generating embeddings...');
        const embeddings = [];
        let successCount = 0;
        let failCount = 0;

        // Run sequential or in small concurrent chunks to show progress
        for (let i = 0; i < verses.length; i++) {
            const verse = verses[i];
            const textToEmbed = `${verse.translation.trim()} ${(verse.commentary || '').trim()}`.trim();
            
            try {
                // Show progress every 50 verses
                if (i % 50 === 0 || i === verses.length - 1) {
                    console.log(`⏳ Processing verse ${i + 1}/${verses.length} (${verse.verse_id})...`);
                }

                const embedding = await geminiService.generateEmbedding(textToEmbed);

                embeddings.push({
                    verse_id: verse.verse_id,
                    embedding: embedding
                });
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to generate embedding for ${verse.verse_id}:`, error.message);
                failCount++;
            }
        }

        console.log(`\n✅ Finished generating BGE embeddings!`);
        console.log(`   Success: ${successCount}/${verses.length}`);
        console.log(`   Failed: ${failCount}/${verses.length}`);

        if (successCount === 0) {
            console.error('❌ No embeddings were generated. Aborting save.');
            process.exit(1);
        }

        // Save embeddings
        console.log(`💾 Saving embeddings to ${EMBEDDINGS_PATH}...`);
        fs.writeFileSync(EMBEDDINGS_PATH, JSON.stringify(embeddings, null, 2));
        console.log('✨ All done successfully!');
    } catch (error) {
        console.error('💥 Fatal error:', error.message);
        process.exit(1);
    }
}

main();

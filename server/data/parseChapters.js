// Load environment variables FIRST before any other requires
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const geminiService = require('../services/geminiService');

const GITA_DATA_DIR = path.join(__dirname, '../../gita-data');
const OUTPUT_DIR = path.join(__dirname);
const BATCH_SIZE = 10; // Process embeddings in batches to avoid rate limits

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Parse a single HTML chapter file
 */
function parseChapterFile(chapterNumber) {
    const filePath = path.join(GITA_DATA_DIR, `${chapterNumber}.html`);

    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Chapter ${chapterNumber}.html not found, skipping...`);
        return [];
    }

    console.log(`📖 Parsing chapter ${chapterNumber}...`);

    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    const verses = [];

    // Find all verse anchors
    $('a[name]').each((index, element) => {
        const anchor = $(element);
        const verseId = anchor.attr('name');

        // Skip if not a valid verse ID (e.g., "1.1", "2.15", etc.)
        if (!verseId || !verseId.match(/^\d+\.\d+(-\d+)?$/)) {
            return;
        }

        const [chapter, verseNum] = verseId.split('.');

        // Collect all content after this anchor until the next anchor
        let currentElement = anchor.parent().next();
        let sanskritParts = [];
        let wordMeanings = '';
        let translation = '';
        let purport = '';
        let section = 'sanskrit'; // sanskrit | translation | purport

        while (currentElement.length > 0) {
            // Stop if we hit the next verse anchor
            if (currentElement.find('a[name]').length > 0) {
                break;
            }

            const text = currentElement.text().trim();

            // Check for section markers
            if (text === 'TRANSLATION') {
                section = 'translation';
            } else if (text === 'PURPORT') {
                section = 'purport';
            } else if (text) {
                // Collect content based on current section
                if (section === 'sanskrit') {
                    // Skip word meanings (they contain em-dashes)
                    if (!text.includes('—')) {
                        sanskritParts.push(text);
                    } else {
                        wordMeanings = text;
                    }
                } else if (section === 'translation') {
                    translation += (translation ? ' ' : '') + text;
                } else if (section === 'purport') {
                    purport += (purport ? ' ' : '') + text;
                }
            }

            currentElement = currentElement.next();
        }

        // Create verse object
        const verse = {
            verse_id: verseId,
            chapter: parseInt(chapter),
            verse_number: verseNum,
            sanskrit: sanskritParts.join(' ').trim(),
            word_meanings: wordMeanings,
            translation: translation.trim(),
            commentary: purport.trim(),
            full_text: `${translation.trim()} ${purport.trim()}`.trim()
        };

        verses.push(verse);
    });

    console.log(`✅ Parsed ${verses.length} verses from chapter ${chapterNumber}`);
    return verses;
}

/**
 * Parse all 18 chapters
 */
function parseAllChapters() {
    console.log('🚀 Starting to parse all 18 chapters...\n');

    const allVerses = [];

    for (let i = 1; i <= 18; i++) {
        const verses = parseChapterFile(i);
        allVerses.push(...verses);
    }

    console.log(`\n📊 Total verses parsed: ${allVerses.length}`);
    return allVerses;
}

/**
 * Generate embeddings for verses in batches
 */
async function generateEmbeddings(verses) {
    console.log(`\n🔮 Generating embeddings for ${verses.length} verses...`);
    console.log(`⏱️  Processing in batches of ${BATCH_SIZE} to avoid rate limits\n`);

    const embeddings = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < verses.length; i += BATCH_SIZE) {
        const batch = verses.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(verses.length / BATCH_SIZE);

        console.log(`📦 Processing batch ${batchNum}/${totalBatches} (verses ${i + 1}-${Math.min(i + BATCH_SIZE, verses.length)})`);

        for (const verse of batch) {
            try {
                const embedding = await geminiService.generateEmbedding(verse.full_text);

                embeddings.push({
                    verse_id: verse.verse_id,
                    embedding: embedding
                });

                successCount++;
                process.stdout.write(`  ✓ ${verse.verse_id} `);

            } catch (error) {
                console.error(`\n  ❌ Failed to generate embedding for ${verse.verse_id}:`, error.message);
                failCount++;
            }
        }

        console.log(`\n  Batch ${batchNum} complete. Success: ${successCount}, Failed: ${failCount}`);

        // Add a small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < verses.length) {
            console.log('  ⏳ Waiting 2 seconds before next batch...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log(`\n✅ Embedding generation complete!`);
    console.log(`   Success: ${successCount}/${verses.length}`);
    console.log(`   Failed: ${failCount}/${verses.length}`);

    return embeddings;
}

/**
 * Save data to JSON files
 */
function saveData(verses, embeddings) {
    console.log('\n💾 Saving data to JSON files...');

    // Save verses (without embeddings)
    const versesPath = path.join(OUTPUT_DIR, 'verses.json');
    const versesData = verses.map(v => ({
        verse_id: v.verse_id,
        chapter: v.chapter,
        verse_number: v.verse_number,
        sanskrit: v.sanskrit,
        word_meanings: v.word_meanings,
        translation: v.translation,
        commentary: v.commentary
    }));

    fs.writeFileSync(versesPath, JSON.stringify(versesData, null, 2));
    console.log(`✅ Saved ${versesData.length} verses to ${versesPath}`);
    console.log(`   File size: ${(fs.statSync(versesPath).size / 1024 / 1024).toFixed(2)} MB`);

    // Save embeddings
    const embeddingsPath = path.join(OUTPUT_DIR, 'embeddings.json');
    fs.writeFileSync(embeddingsPath, JSON.stringify(embeddings, null, 2));
    console.log(`✅ Saved ${embeddings.length} embeddings to ${embeddingsPath}`);
    console.log(`   File size: ${(fs.statSync(embeddingsPath).size / 1024 / 1024).toFixed(2)} MB`);
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('═'.repeat(60));
        console.log('  BHAGAVAD GITA DATA PARSER & EMBEDDING GENERATOR');
        console.log('═'.repeat(60));
        console.log();

        // Step 1: Parse HTML files
        const verses = parseAllChapters();

        if (verses.length === 0) {
            console.error('❌ No verses found. Please check the gita-data directory.');
            process.exit(1);
        }

        // Step 2: Generate embeddings
        const embeddings = await generateEmbeddings(verses);

        if (embeddings.length === 0) {
            console.error('❌ No embeddings generated. Aborting.');
            process.exit(1);
        }

        // Step 3: Save to JSON files
        saveData(verses, embeddings);

        console.log('\n' + '═'.repeat(60));
        console.log('  ✨ ALL DONE! Database-free static data ready!');
        console.log('═'.repeat(60));
        console.log('\nNext steps:');
        console.log('1. Review the generated JSON files in server/data/');
        console.log('2. Create server/cache.js to load these files');
        console.log('3. Update routes to use cache instead of database');
        console.log('4. Commit verses.json and embeddings.json to git');
        console.log();

    } catch (error) {
        console.error('\n💥 Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { parseAllChapters, generateEmbeddings, saveData };

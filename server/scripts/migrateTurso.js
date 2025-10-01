const { getTursoClient } = require('../config/turso');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

/**
 * Migration script for importing Bhagavad Gita data into Turso
 * This script can import data from JSON files
 */

async function migrateFromJSON(filePath) {
  console.log(`📥 Importing data from ${filePath}...\n`);

  const client = getTursoClient();

  try {
    // Read JSON file
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    if (!data.chapters || !Array.isArray(data.chapters)) {
      throw new Error('Invalid JSON format. Expected { chapters: [...] }');
    }

    let totalChapters = 0;
    let totalVerses = 0;

    // Process each chapter
    for (const chapterData of data.chapters) {
      console.log(`📖 Processing Chapter ${chapterData.chapter_number}...`);

      // Insert chapter
      const chapterResult = await client.execute({
        sql: `INSERT OR REPLACE INTO chapters 
              (chapter_number, title_sanskrit, title_english, title_transliteration, summary, verse_count) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          chapterData.chapter_number,
          chapterData.title_sanskrit,
          chapterData.title_english,
          chapterData.title_transliteration || null,
          chapterData.summary || null,
          chapterData.verses ? chapterData.verses.length : 0
        ]
      });

      const chapterId = chapterResult.lastInsertRowid;
      totalChapters++;

      // Insert verses if present
      if (chapterData.verses && Array.isArray(chapterData.verses)) {
        for (const verseData of chapterData.verses) {
          await client.execute({
            sql: `INSERT OR REPLACE INTO verses 
                  (chapter_id, verse_number, sanskrit_text, transliteration, word_meanings, translation_english, purport) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
              chapterId,
              verseData.verse_number,
              verseData.sanskrit_text,
              verseData.transliteration || null,
              verseData.word_meanings || null,
              verseData.translation_english,
              verseData.purport || null
            ]
          });
          totalVerses++;
        }
        console.log(`  ✅ Imported ${chapterData.verses.length} verses`);
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`📊 Imported ${totalChapters} chapters and ${totalVerses} verses`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

/**
 * Example JSON structure:
 * {
 *   "chapters": [
 *     {
 *       "chapter_number": 1,
 *       "title_sanskrit": "अर्जुनविषादयोग",
 *       "title_english": "Arjuna Vishada Yoga",
 *       "title_transliteration": "Arjuna Viṣāda Yoga",
 *       "summary": "Chapter summary...",
 *       "verses": [
 *         {
 *           "verse_number": 1,
 *           "sanskrit_text": "Sanskrit text...",
 *           "transliteration": "Transliteration...",
 *           "word_meanings": "Word by word meanings...",
 *           "translation_english": "English translation...",
 *           "purport": "Purport/commentary..."
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npm run migrate-turso <json-file-path>');
  console.log('Example: npm run migrate-turso ./data/bhagavad-gita.json');
  process.exit(1);
}

const filePath = path.resolve(args[0]);

migrateFromJSON(filePath)
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });

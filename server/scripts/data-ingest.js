const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const { getTursoClient } = require('../config/turso');
require('dotenv').config();

/**
 * Data Ingestion Script for Bhagavad Gita HTML Files
 * 
 * This script parses HTML files from the 'gita-data' folder (1.html to 18.html)
 * and inserts chapter titles, verses, Sanskrit text, translations, and purports
 * into the Turso database.
 * 
 * HTML Structure:
 * - Chapter title: <h1> (second h1 tag)
 * - Verse anchor: <a name="1.1"><strong>1.1</strong></a>
 * - Sanskrit (transliteration): <p> tags after verse anchor
 * - Word meanings: <p> with word-by-word meanings
 * - Translation: After <p><strong>TRANSLATION</strong></p>
 * - Purport: After <p><strong>PURPORT</strong></p>
 * 
 * Usage: npm run ingest-gita
 */

// Configuration
const DATA_FOLDER = path.join(__dirname, '../../gita-data');
const TOTAL_CHAPTERS = 18;
const DEBUG_MODE = true; // Set to true to log extracted data

// Statistics
let stats = {
  chaptersProcessed: 0,
  versesInserted: 0,
  errors: 0,
  startTime: Date.now()
};

/**
 * Parse a single HTML file and extract chapter and verse data
 * @param {string} filePath - Path to the HTML file
 * @param {number} chapterNumber - Chapter number
 * @returns {Object} Parsed chapter data
 */
async function parseHTMLFile(filePath, chapterNumber) {
  try {
    const html = await fs.readFile(filePath, 'utf8');
    const $ = cheerio.load(html);

    // Initialize chapter data
    const chapterData = {
      chapter_number: chapterNumber,
      title_sanskrit: '',
      title_english: '',
      title_transliteration: '',
      summary: '',
      verses: []
    };

    // Extract chapter title - it's the second h1 tag
    const h1Elements = $('h1');
    if (h1Elements.length >= 2) {
      chapterData.title_english = $(h1Elements[1]).text().trim();
    } else {
      chapterData.title_english = `Chapter ${chapterNumber}`;
    }

    // Extract verses by finding all verse anchors
    const verseAnchors = $('a[name^="' + chapterNumber + '."]');
    
    console.log(`  📖 Found ${verseAnchors.length} verse anchors`);

    verseAnchors.each((index, anchor) => {
      const $anchor = $(anchor);
      const verseName = $anchor.attr('name'); // e.g., "1.1" or "1.16-18"
      
      // Extract verse data starting from this anchor
      const verse = extractVerseFromAnchor($, $anchor, verseName, chapterNumber);
      
      if (verse) {
        chapterData.verses.push(verse);
        
        // Log first verse for debugging
        if (DEBUG_MODE && index === 0) {
          console.log(`\n  🔍 Sample verse ${verseName}:`);
          console.log(`     Sanskrit: ${verse.sanskrit_text.substring(0, 50)}...`);
          console.log(`     Translation: ${verse.translation_english.substring(0, 50)}...`);
          console.log(`     Purport: ${verse.purport.substring(0, 50)}...`);
        }
      }
    });

    console.log(`  ✅ Extracted ${chapterData.verses.length} verses`);
    return chapterData;

  } catch (error) {
    console.error(`  ❌ Error parsing file ${filePath}:`, error.message);
    stats.errors++;
    return null;
  }
}

/**
 * Extract verse data starting from an anchor element
 * @param {CheerioAPI} $ - Cheerio instance
 * @param {Cheerio} $anchor - Anchor element
 * @param {string} verseName - Verse name (e.g., "1.1" or "1.16-18")
 * @param {number} chapterNumber - Chapter number
 * @returns {Object} Verse data
 */
function extractVerseFromAnchor($, $anchor, verseName, chapterNumber) {
  const verse = {
    verse_number: parseVerseNumber(verseName),
    sanskrit_text: '',
    transliteration: '',
    word_meanings: '',
    translation_english: '',
    purport: ''
  };

  // Get all <p> elements after the anchor until the next verse anchor
  let currentElement = $anchor.parent().next();
  let sanskritLines = [];
  let inTranslation = false;
  let inPurport = false;
  let translationLines = [];
  let purportLines = [];

  while (currentElement.length > 0) {
    const tagName = currentElement.prop('tagName');
    
    // Stop if we hit another verse anchor
    if (tagName === 'P' && currentElement.find('a[name^="' + chapterNumber + '."]').length > 0) {
      break;
    }

    if (tagName === 'P') {
      const text = currentElement.text().trim();
      const html = currentElement.html();
      
      // Check for TRANSLATION marker
      if (html && html.includes('<strong>TRANSLATION</strong>')) {
        inTranslation = true;
        inPurport = false;
      }
      // Check for PURPORT marker
      else if (html && html.includes('<strong>PURPORT</strong>')) {
        inPurport = true;
        inTranslation = false;
      }
      // Collect text based on current section
      else if (text.length > 0) {
        if (inPurport) {
          purportLines.push(text);
        } else if (inTranslation) {
          translationLines.push(text);
        } else {
          // Before TRANSLATION, collect Sanskrit/word meanings
          // Word meanings contain em-dashes or semicolons
          if (text.includes('—') || text.includes(';')) {
            verse.word_meanings = text;
          } else {
            sanskritLines.push(text);
          }
        }
      }
    }

    currentElement = currentElement.next();
  }

  // Combine Sanskrit lines (transliteration)
  verse.sanskrit_text = sanskritLines.join(' ').trim();
  verse.transliteration = verse.sanskrit_text; // Same as Sanskrit in this format

  // Combine translation
  verse.translation_english = translationLines.join(' ').trim();

  // Combine purport
  verse.purport = purportLines.join('\n\n').trim();

  return verse;
}

/**
 * Parse verse number from verse name
 * @param {string} verseName - e.g., "1.1" or "1.16-18"
 * @returns {number} First verse number
 */
function parseVerseNumber(verseName) {
  const match = verseName.match(/\.(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Insert chapter data into Turso database
 * @param {Object} chapterData - Chapter data to insert
 */
async function insertChapterData(chapterData) {
  const client = getTursoClient();

  try {
    // Insert chapter
    const chapterResult = await client.execute({
      sql: `INSERT OR REPLACE INTO chapters 
            (chapter_number, title_sanskrit, title_english, title_transliteration, summary, verse_count) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        chapterData.chapter_number,
        chapterData.title_sanskrit || `Chapter ${chapterData.chapter_number}`,
        chapterData.title_english || `Chapter ${chapterData.chapter_number}`,
        chapterData.title_transliteration || '',
        chapterData.summary || '',
        chapterData.verses.length
      ]
    });

    const chapterId = chapterResult.lastInsertRowid;
    console.log(`  ✅ Inserted chapter ${chapterData.chapter_number} (ID: ${chapterId})`);

    // Insert verses in batches for better performance
    const batchSize = 50;
    for (let i = 0; i < chapterData.verses.length; i += batchSize) {
      const batch = chapterData.verses.slice(i, i + batchSize);
      
      const queries = batch.map(verse => ({
        sql: `INSERT OR REPLACE INTO verses 
              (chapter_id, verse_number, sanskrit_text, transliteration, word_meanings, translation_english, purport) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          chapterId,
          verse.verse_number,
          verse.sanskrit_text || '',
          verse.transliteration || '',
          verse.word_meanings || '',
          verse.translation_english || `Verse ${verse.verse_number}`,
          verse.purport || ''
        ]
      }));

      await client.batch(queries);
      stats.versesInserted += batch.length;
      
      if (batch.length > 0) {
        console.log(`  📝 Inserted verses ${i + 1} to ${i + batch.length}`);
      }
    }

    stats.chaptersProcessed++;

  } catch (error) {
    console.error(`  ❌ Error inserting chapter ${chapterData.chapter_number}:`, error.message);
    stats.errors++;
    throw error;
  }
}

/**
 * Process all HTML files in the gita-data folder
 */
async function processAllFiles() {
  console.log('🚀 Starting Bhagavad Gita data ingestion...\n');
  console.log(`📁 Reading from: ${DATA_FOLDER}\n`);

  // Check if data folder exists
  try {
    await fs.access(DATA_FOLDER);
  } catch (error) {
    console.error(`❌ Error: Data folder not found at ${DATA_FOLDER}`);
    console.error('Please create the folder and add HTML files (1.html to 18.html)');
    process.exit(1);
  }

  // Process each chapter file
  for (let chapterNum = 1; chapterNum <= TOTAL_CHAPTERS; chapterNum++) {
    const fileName = `${chapterNum}.html`;
    const filePath = path.join(DATA_FOLDER, fileName);

    console.log(`\n📖 Processing Chapter ${chapterNum} (${fileName})...`);

    try {
      // Check if file exists
      await fs.access(filePath);

      // Parse HTML file
      const chapterData = await parseHTMLFile(filePath, chapterNum);

      if (chapterData && chapterData.verses.length > 0) {
        // Insert into database
        await insertChapterData(chapterData);
      } else {
        console.log(`  ⚠️  No data extracted from ${fileName}`);
        stats.errors++;
      }

    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`  ⚠️  File not found: ${fileName} (skipping)`);
      } else {
        console.error(`  ❌ Error processing ${fileName}:`, error.message);
        stats.errors++;
      }
    }
  }
}

/**
 * Print final statistics
 */
function printStats() {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 INGESTION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Chapters processed: ${stats.chaptersProcessed}/${TOTAL_CHAPTERS}`);
  console.log(`✅ Verses inserted: ${stats.versesInserted}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log('='.repeat(60));

  if (stats.chaptersProcessed === TOTAL_CHAPTERS && stats.errors === 0) {
    console.log('\n🎉 All chapters and verses successfully ingested!');
  } else if (stats.errors > 0) {
    console.log('\n⚠️  Some errors occurred during ingestion. Please review the logs above.');
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await processAllFiles();
    printStats();
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    printStats();
    process.exit(1);
  }
}

// Run the script
main();

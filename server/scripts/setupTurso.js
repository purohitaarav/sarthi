const { getTursoClient } = require('../config/turso');
require('dotenv').config();

/**
 * Setup Turso database schema for Bhagavad Gita content
 */
async function setupTursoSchema() {
  console.log('🚀 Setting up Turso database schema...\n');

  const client = getTursoClient();

  try {
    // Create chapters table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY,
        chapter_number INTEGER UNIQUE NOT NULL,
        title_sanskrit TEXT NOT NULL,
        title_english TEXT NOT NULL,
        title_transliteration TEXT,
        summary TEXT,
        verse_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created chapters table');

    // Create verses table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY,
        chapter_id INTEGER NOT NULL,
        verse_number INTEGER NOT NULL,
        sanskrit_text TEXT NOT NULL,
        transliteration TEXT,
        word_meanings TEXT,
        translation_english TEXT NOT NULL,
        purport TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
        UNIQUE(chapter_id, verse_number)
      )
    `);
    console.log('✅ Created verses table');

    // Create index for faster lookups
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_verses_chapter 
      ON verses(chapter_id)
    `);
    console.log('✅ Created index on verses.chapter_id');

    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_verses_chapter_verse 
      ON verses(chapter_id, verse_number)
    `);
    console.log('✅ Created index on verses(chapter_id, verse_number)');

    // Create translations table (for multiple language support)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY,
        verse_id INTEGER NOT NULL,
        language_code TEXT NOT NULL,
        translation TEXT NOT NULL,
        translator TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE,
        UNIQUE(verse_id, language_code)
      )
    `);
    console.log('✅ Created translations table');

    // Create commentaries table (for different commentators)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS commentaries (
        id INTEGER PRIMARY KEY,
        verse_id INTEGER NOT NULL,
        commentator TEXT NOT NULL,
        commentary TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created commentaries table');

    // Insert sample chapter data
    await insertSampleData(client);

    console.log('\n✅ Turso database schema setup complete!');
    console.log('📊 Tables created: chapters, verses, translations, commentaries');
    
  } catch (error) {
    console.error('❌ Error setting up Turso schema:', error.message);
    throw error;
  }
}

/**
 * Insert sample Bhagavad Gita data
 */
async function insertSampleData(client) {
  console.log('\n📝 Inserting sample data...');

  try {
    // Insert sample chapters
    const chapters = [
      {
        chapter_number: 1,
        title_sanskrit: 'अर्जुनविषादयोग',
        title_english: 'Arjuna Vishada Yoga',
        title_transliteration: 'Arjuna Viṣāda Yoga',
        summary: 'The first chapter of the Bhagavad Gita - "Arjuna Vishada Yoga" introduces the setup, the setting, the characters and the circumstances that led to the epic battle of Mahabharata, fought between the Pandavas and the Kauravas.',
        verse_count: 47
      },
      {
        chapter_number: 2,
        title_sanskrit: 'सांख्ययोग',
        title_english: 'Sankhya Yoga',
        title_transliteration: 'Sāṅkhya Yoga',
        summary: 'The second chapter of the Bhagavad Gita is "Sankhya Yoga". This chapter discusses the immortality of the soul, the nature of the self, and the path of knowledge.',
        verse_count: 72
      }
    ];

    for (const chapter of chapters) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO chapters 
              (chapter_number, title_sanskrit, title_english, title_transliteration, summary, verse_count) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          chapter.chapter_number,
          chapter.title_sanskrit,
          chapter.title_english,
          chapter.title_transliteration,
          chapter.summary,
          chapter.verse_count
        ]
      });
    }
    console.log('✅ Inserted sample chapters');

    // Insert sample verses
    const verses = [
      {
        chapter_id: 1,
        verse_number: 1,
        sanskrit_text: 'धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||',
        transliteration: 'dhṛitarāśhtra uvācha dharma-kṣhetre kuru-kṣhetre samavetā yuyutsavaḥ māmakāḥ pāṇḍavāśhchaiva kimakurvata sañjaya',
        translation_english: 'Dhritarashtra said: O Sanjay, after gathering on the holy field of Kurukshetra, and desiring to fight, what did my sons and the sons of Pandu do?',
        purport: 'This verse sets the stage for the Bhagavad Gita. Dhritarashtra, the blind king, asks Sanjay about the events on the battlefield of Kurukshetra.'
      },
      {
        chapter_id: 2,
        verse_number: 47,
        sanskrit_text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन | मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||',
        transliteration: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo \'stvakarmaṇi',
        translation_english: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.',
        purport: 'This is one of the most famous verses of the Bhagavad Gita, teaching the principle of Nishkama Karma (selfless action). Lord Krishna instructs Arjuna to focus on performing his duty without attachment to the results.'
      }
    ];

    for (const verse of verses) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO verses 
              (chapter_id, verse_number, sanskrit_text, transliteration, translation_english, purport) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          verse.chapter_id,
          verse.verse_number,
          verse.sanskrit_text,
          verse.transliteration,
          verse.translation_english,
          verse.purport
        ]
      });
    }
    console.log('✅ Inserted sample verses');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
    throw error;
  }
}

// Run the setup
setupTursoSchema()
  .then(() => {
    console.log('\n🎉 Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error);
    process.exit(1);
  });

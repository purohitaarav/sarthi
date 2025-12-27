const { executeQuery, closeTurso } = require('../config/turso');

async function setupTursoSchema() {
  console.log('🚀 Setting up Turso database schema...\n');

  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_number INTEGER NOT NULL UNIQUE,
        title_english TEXT
      );
    `);
    console.log('✅ Created chapters table');

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        verse_number INTEGER NOT NULL,
        translation_english TEXT,
        purport TEXT,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id)
      );
    `);
    console.log('✅ Created verses table');

    await executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_verses_chapter_id
      ON verses(chapter_id);
    `);

    await executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_verses_chapter_verse
      ON verses(chapter_id, verse_number);
    `);
    console.log('✅ Created verse indexes');

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS verse_embeddings (
        verse_id INTEGER PRIMARY KEY,
        embedding BLOB NOT NULL,
        FOREIGN KEY (verse_id) REFERENCES verses(id)
      );
    `);
    console.log('✅ Created verse_embeddings table');

    console.log('\n🎉 Turso schema setup completed successfully!');
  } catch (err) {
    console.error('\n💥 Schema setup failed:', err.message);
    throw err;
  } finally {
    await closeTurso();
  }
}

setupTursoSchema();

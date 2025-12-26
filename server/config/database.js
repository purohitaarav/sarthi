const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database/sarthi.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');

    // Attach gita database for cross-database joins
    const gitaDbPath = path.join(__dirname, '../database/gita.db');
    db.run(`ATTACH DATABASE '${gitaDbPath}' AS gita`, (err) => {
      if (err) {
        console.error('❌ Error attaching gita database:', err.message);
      } else {
        console.log('✅ Attached gita database');
      }
    });
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;

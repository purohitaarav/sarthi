const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
const dbPath = path.join(dbDir, 'sarthi.db');

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error creating database:', err.message);
    process.exit(1);
  }
  console.log('✅ Database file created');
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err.message);
    } else {
      console.log('✅ Users table created');
    }
  });

  // Items table (example resource)
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating items table:', err.message);
    } else {
      console.log('✅ Items table created');
    }
  });

  // Insert sample data
  db.run(`
    INSERT OR IGNORE INTO users (id, username, email, password)
    VALUES (1, 'demo', 'demo@sarthi.com', '$2a$10$YourHashedPasswordHere')
  `, (err) => {
    if (err) {
      console.error('❌ Error inserting sample user:', err.message);
    } else {
      console.log('✅ Sample user created');
    }
  });

  db.run(`
    INSERT OR IGNORE INTO items (title, description, user_id)
    VALUES ('Sample Item', 'This is a sample item', 1)
  `, (err) => {
    if (err) {
      console.error('❌ Error inserting sample item:', err.message);
    } else {
      console.log('✅ Sample item created');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('❌ Error closing database:', err.message);
  } else {
    console.log('✅ Database setup complete!');
  }
});

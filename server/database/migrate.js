const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const db = require('../config/database');

// Convert callback-based db methods to promise-based
const run = promisify(db.run.bind(db));
const all = promisify(db.all.bind(db));

async function runMigrations() {
  try {
    // Create migrations table if it doesn't exist
    await run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all already executed migrations
    const executedMigrations = await all('SELECT name FROM migrations');
    const executedMigrationNames = new Set(executedMigrations.map(m => m.name));

    // Read migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Execute pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrationNames.has(file)) {
        console.log(`Running migration: ${file}`);
        const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        // Run each statement separately
        const statements = migrationSQL.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (const stmt of statements) {
          await run(stmt);
        }
        
        // Record the migration
        await run('INSERT INTO migrations (name) VALUES (?)', [file]);
        console.log(`✓ ${file} completed`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    db.close();
  }
}

runMigrations();

const { createClient } = require('@libsql/client');
const path = require('path');

let tursoClient = null;

/**
 * Decide whether to use Turso or local SQLite.
 *
 * Rules:
 * - FORCE_TURSO=true  → always use Turso (for setup / embeddings)
 * - NODE_ENV=production → use Turso
 * - Otherwise → local SQLite
 */
function resolveDatabaseURL() {
  const forceTurso = process.env.FORCE_TURSO === 'true';
  const isProduction = process.env.NODE_ENV === 'production';

  if (forceTurso || isProduction) {
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error(
        'TURSO_DATABASE_URL is required when using Turso (FORCE_TURSO or production)'
      );
    }
    console.log('🌐 Using remote Turso database');
    return process.env.TURSO_DATABASE_URL;
  }

  console.log('⚠️ Development mode: using local SQLite');
  return `file:${path.join(__dirname, '../database/gita.db')}`;
}

/**
 * Initialize Turso / SQLite client
 */
function initializeTurso() {
  if (tursoClient) {
    return tursoClient;
  }

  const dbUrl = resolveDatabaseURL();

  console.log('🔌 Database Config:', {
    cwd: process.cwd(),
    configFile: __filename,
    dbUrl,
    hasAuthToken: Boolean(process.env.TURSO_AUTH_TOKEN),
    nodeEnv: process.env.NODE_ENV,
    forceTurso: process.env.FORCE_TURSO,
  });

  const config = { url: dbUrl };

  if (dbUrl.startsWith('libsql://')) {
    if (!process.env.TURSO_AUTH_TOKEN) {
      throw new Error('TURSO_AUTH_TOKEN is required for remote Turso');
    }
    config.authToken = process.env.TURSO_AUTH_TOKEN;
  }

  try {
    tursoClient = createClient(config);
    console.log('✅ Database client initialized');
    return tursoClient;
  } catch (error) {
    console.error('❌ Failed to initialize database client:', error);
    throw error;
  }
}

/**
 * Get active DB client
 */
function getTursoClient() {
  return tursoClient || initializeTurso();
}

/**
 * Execute a single query
 */
async function executeQuery(sql, params = []) {
  const client = getTursoClient();
  try {
    const result = await client.execute({
      sql,
      args: params,
    });
    return result;
  } catch (error) {
    console.error('❌ Query execution failed:', {
      sql: sql.slice(0, 120),
      error: error.message,
    });
    throw error;
  }
}

/**
 * Execute multiple queries in a transaction
 */
async function executeTransaction(queries) {
  const client = getTursoClient();
  try {
    return await client.batch(queries);
  } catch (error) {
    console.error('❌ Transaction failed:', error.message);
    throw error;
  }
}

/**
 * Close DB connection
 */
async function closeTurso() {
  if (tursoClient) {
    await tursoClient.close();
    tursoClient = null;
    console.log('✅ Database connection closed');
  }
}

module.exports = {
  initializeTurso,
  getTursoClient,
  executeQuery,
  executeTransaction,
  closeTurso,
};

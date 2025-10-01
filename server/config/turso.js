const { createClient } = require('@libsql/client');
const path = require('path');

let tursoClient = null;

/**
 * Initialize Turso database client
 * Supports both local file and remote Turso database
 */
function initializeTurso() {
  if (tursoClient) {
    return tursoClient;
  }

  // Use absolute path for local file database
  const dbPath = process.env.TURSO_DATABASE_URL || 
                 `file:${path.join(__dirname, '../database/gita.db')}`;

  const config = {
    url: dbPath,
  };

  // Add auth token if using remote Turso database
  if (process.env.TURSO_AUTH_TOKEN) {
    config.authToken = process.env.TURSO_AUTH_TOKEN;
  }

  try {
    tursoClient = createClient(config);
    console.log('✅ Turso database client initialized');
    return tursoClient;
  } catch (error) {
    console.error('❌ Failed to initialize Turso client:', error.message);
    throw error;
  }
}

/**
 * Get Turso database client instance
 */
function getTursoClient() {
  if (!tursoClient) {
    return initializeTurso();
  }
  return tursoClient;
}

/**
 * Execute a query on Turso database
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
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
    console.error('Query execution error:', error.message);
    throw error;
  }
}

/**
 * Execute multiple queries in a transaction
 * @param {Array} queries - Array of {sql, args} objects
 * @returns {Promise<Array>} Array of results
 */
async function executeTransaction(queries) {
  const client = getTursoClient();
  try {
    const results = await client.batch(queries);
    return results;
  } catch (error) {
    console.error('Transaction execution error:', error.message);
    throw error;
  }
}

/**
 * Close the database connection
 */
async function closeTurso() {
  if (tursoClient) {
    await tursoClient.close();
    tursoClient = null;
    console.log('✅ Turso database connection closed');
  }
}

module.exports = {
  initializeTurso,
  getTursoClient,
  executeQuery,
  executeTransaction,
  closeTurso,
};

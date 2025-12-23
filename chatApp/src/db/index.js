import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'chatapp_user',
  password: process.env.DB_PASSWORD || 'chatapp_password',
  database: process.env.DB_NAME || 'chatapp_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
export async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    return false;
  }
}

// Query helper function
export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log(`Executed query: ${text.substring(0, 50)}... Duration: ${duration}ms`);
  return result;
}

// Get a client from the pool (for transactions)
export async function getClient() {
  return await pool.connect();
}

// Graceful shutdown
export async function closeDB() {
  await pool.end();
  console.log('PostgreSQL pool closed');
}

export default pool;

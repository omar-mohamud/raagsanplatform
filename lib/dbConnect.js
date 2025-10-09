import { Pool } from 'pg';

let pool = null;

function getPool() {
  if (!pool) {
    // Use Netlify database URL if available, otherwise fall back to DATABASE_URL
    const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      console.warn("⚠️ No database URL found in environment variables");
      return null;
    }

    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    // Test the connection
    pool.on('connect', () => {
      console.log('✅ PostgreSQL connected successfully');
    });

    pool.on('error', (err) => {
      console.error('❌ PostgreSQL connection error:', err);
    });
  }
  
  return pool;
}

export async function dbConnect() {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error("DATABASE_URL not configured. Please check your environment variables.");
  }
  
  try {
    console.log('🔄 Attempting PostgreSQL connection...');
    const client = await currentPool.connect();
    console.log('✅ PostgreSQL connection established');
    
    // Test the connection with a simple query
    await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL query test successful');
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    throw error;
  }
}

// Function to get a client from the pool
export async function getClient() {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error("DATABASE_URL not configured. Please check your environment variables.");
  }
  return await currentPool.connect();
}

// Function to execute a query
export async function query(text, params) {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error("DATABASE_URL not configured. Please check your environment variables.");
  }
  const client = await currentPool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Function to close the pool (useful for testing)
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
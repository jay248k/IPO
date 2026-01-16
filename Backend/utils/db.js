import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv'
dotenv.config();

const pool = new Pool({
  connectionString:process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

// Handle connection errors gracefully
pool.on('error', (err) => {
  console.error("❌ Unexpected DB pool error:", err.message);
});

// Test connection
pool.connect()
  .then((client) => {
    console.log("✅ PostgreSQL (Neon) connected successfully!");
    client.release();
  })
  .catch(err => console.error("❌ Neon DB connection error:", err.message));

export default pool;

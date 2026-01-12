import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv'
dotenv.config();

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_3kcVxsDAQ4tW@ep-nameless-tree-ahhkivhh-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
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

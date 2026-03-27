require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const { Pool } = require('pg');

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`)
.then(() => { console.log('✅ Table users créée (ou déjà existante)'); db.end(); })
.catch(e => { console.error('❌', e.message); db.end(); process.exit(1); });

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS message (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL
    );
  `);

  const { rows } = await pool.query('SELECT COUNT(*) FROM message');
  if (parseInt(rows[0].count, 10) === 0) {
    await pool.query('INSERT INTO message (content) VALUES ($1)', ['Hello from Docker']);
  }
}

async function getMessage() {
  const result = await pool.query('SELECT content FROM message ORDER BY id LIMIT 1');
  return result.rows[0]?.content || 'No message found.';
}

async function setMessage(newMessage) {
  const result = await pool.query('SELECT id FROM message ORDER BY id LIMIT 1');
  if (result.rows.length > 0) {
    await pool.query('UPDATE message SET content = $1 WHERE id = $2', [newMessage, result.rows[0].id]);
  } else {
    await pool.query('INSERT INTO message (content) VALUES ($1)', [newMessage]);
  }
}

module.exports = { initDB, getMessage, setMessage };
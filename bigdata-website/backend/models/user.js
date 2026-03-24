// models/user.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || 'bigdata_isp_v2',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'BigData_Postgres_2025_Secure!'
});

async function findByEmail(email) {
  try {
    const res = await pool.query('SELECT * FROM clientes_cloud WHERE email = $1', [email]);
    if (res.rows.length > 0) {
      const user = res.rows[0];
      // Mapeamos password_hash a password para compatibilidad con server.js
      user.password = user.password_hash;
      return user;
    }
    return null;
  } catch (err) {
    console.error('Error buscando usuario:', err);
    return null;
  }
}

module.exports = { findByEmail };

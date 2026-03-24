require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const auth = require('../middleware/auth');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres-shared',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || 'bigdata_isp_v2',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD
});

// Middleware para verificar que el usuario es admin
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticación requerida' });
  }
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol admin' });
  }
  next();
}

// POST /api/admin/create-user
// Requiere autenticación + rol admin
router.post('/create-user', auth, requireAdmin, async (req, res) => {
  const {
    nombre, apellido, email, password, telefono,
    empresa, tipo_documento, documento
  } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({ error: 'Email, Password y Nombre requeridos' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO clientes_cloud (
        email, password_hash, nombre, apellido, telefono,
        estado, estado_verificacion, empresa, tipo_documento, documento,
        fecha_creacion, saldo_creditos
      ) VALUES ($1, $2, $3, $4, $5, 'ACTIVO', 'VERIFICADO', $6, $7, $8, NOW(), 0)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        nombre = EXCLUDED.nombre,
        apellido = EXCLUDED.apellido,
        estado = 'ACTIVO',
        estado_verificacion = 'VERIFICADO'
      RETURNING id;
    `;

    const result = await pool.query(query, [
      email, hash, nombre, apellido, telefono,
      empresa || 'Particular', tipo_documento || 'CC', documento || ''
    ]);

    res.json({
      success: true,
      id: result.rows[0].id,
      message: '✅ Usuario creado y activado correctamente'
    });

  } catch (err) {
    console.error('❌ Error admin route:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

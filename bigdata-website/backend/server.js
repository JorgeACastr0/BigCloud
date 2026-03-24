/**
 * BigData SAS – Backend API
 * Estado: v5.0 - Hardened + Rate Limiting + WebSocket Bridge
 */

require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const rateLimit = require('express-rate-limit');

const auth = require('./middleware/auth');
const { findByEmail } = require('./models/user');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3006;

// ========================
// Middlewares globales
// ========================
app.use(cors());
app.use(express.json());
// En producción con Traefik usar 1 (un solo proxy), en desarrollo false
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// ========================
// RATE LIMITING
// ========================
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_GENERAL) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta nuevamente en 15 minutos.' }
});

const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_LOGIN) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de login. Intenta nuevamente en 15 minutos.' }
});

app.use('/api/', generalLimiter);

// ========================
// CACHE TRM
// ========================
let trmCache = {
  rate: parseInt(process.env.USD_TO_COP_RATE) || 4200,
  lastFetch: 0,
  ttl: 3600000
};

// ========================
// CLIENTE VULTR
// ========================
const vultrClient = axios.create({
  baseURL: 'https://api.vultr.com/v2',
  headers: {
    Authorization: `Bearer ${process.env.VULTR_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// ========================
// LOGIN (JWT) con rate limit estricto
// ========================
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password requeridos' });
    }

    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol || 'cliente' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return res.status(500).json({ error: 'Error interno de login' });
  }
});

// ========================
// RUTA PROTEGIDA (TEST)
// ========================
app.get('/api/me', auth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// ========================
// RUTAS CLOUD + ADMIN + PAGOS
// ========================
const cloudRoutes = require('./routes/cloud');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');

app.use('/api/cloud', cloudRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// ========================
// WEBSOCKET BRIDGE (No-VPN) - PARACAIDAS DE SEGURIDAD
// ========================
try {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ noServer: true });

  const PROXMOX_HOST = process.env.PROXMOX_HOST;
  const PROXMOX_PORT = process.env.PROXMOX_PORT || '8006';
  const PROXMOX_USER = process.env.PROXMOX_USER;
  const PROXMOX_TOKEN_ID = process.env.PROXMOX_TOKEN_ID;
  const PROXMOX_TOKEN_SECRET = process.env.PROXMOX_TOKEN_SECRET;
  const PROXMOX_NODE = process.env.PROXMOX_NODE || 'servidor1';
  const proxmoxAuthHeader = `PVEAPIToken=${PROXMOX_USER}!${PROXMOX_TOKEN_ID}=${PROXMOX_TOKEN_SECRET}`;

  wss.on('connection', (userWs, req, proxmoxUrl) => {
    console.log(`🔌 Bridge activo -> Proxmox`);

    const proxmoxWs = new WebSocket(proxmoxUrl, {
      rejectUnauthorized: process.env.PROXMOX_REJECT_UNAUTHORIZED !== 'false',
      headers: {
        'Authorization': proxmoxAuthHeader
      }
    });

    proxmoxWs.on('open', () => { console.log('✅ Bridge conectado exitosamente a Proxmox'); });

    userWs.on('message', (msg) => { if (proxmoxWs.readyState === WebSocket.OPEN) proxmoxWs.send(msg); });
    proxmoxWs.on('message', (msg) => { if (userWs.readyState === WebSocket.OPEN) userWs.send(msg); });

    proxmoxWs.on('close', () => { userWs.close(); });
    userWs.on('close', () => { proxmoxWs.close(); });
    proxmoxWs.on('error', (e) => console.error('❌ Proxmox WS Error:', e.message));
    userWs.on('error', (e) => console.error('❌ User WS Error:', e.message));
  });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/api/vps-console') {
      const ticket = url.searchParams.get('ticket');
      const port = url.searchParams.get('port');
      const vmid = url.searchParams.get('vmid');
      const type = url.searchParams.get('type');
      const node = url.searchParams.get('node') || PROXMOX_NODE;
      const proxmoxUrl = `wss://${PROXMOX_HOST}:${PROXMOX_PORT}/api2/json/nodes/${node}/${type}/${vmid}/vncwebsocket?port=${port}&vncticket=${encodeURIComponent(ticket)}`;

      wss.handleUpgrade(request, socket, head, (ws) => { wss.emit('connection', ws, request, proxmoxUrl); });
    } else {
      socket.destroy();
    }
  });
  console.log('✅ WebSocket Bridge initialized successfully');
} catch (e) {
  console.error('⚠️ ALERTA: Falló la inicialización del Bridge:', e.message);
}

// ========================
// START
// ========================
server.listen(PORT, () => {
  console.log(`✅ Backend API v5.0 (Hardened) running on port ${PORT}`);
});

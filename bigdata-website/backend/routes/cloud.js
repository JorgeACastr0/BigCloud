require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const proxmox = require('../services/proxmox');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres-shared',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || 'bigdata_isp_v2',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD
});

// ============================================================
// Genera un password único, seguro y memorable para cada VM
// ============================================================
function generateSecurePassword(length = 16) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%&*';
  const all = upper + lower + digits + special;

  // Garantizar al menos uno de cada tipo
  let password = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)]
  ];

  // Rellenar el resto con bytes aleatorios criptográficamente seguros
  const bytes = crypto.randomBytes(length - 4);
  for (let i = 0; i < length - 4; i++) {
    password.push(all[bytes[i] % all.length]);
  }

  // Mezclar para que los caracteres garantizados no estén siempre al inicio
  return password.sort(() => crypto.randomInt(3) - 1).join('');
}

// GET /api/cloud/planes
router.get('/planes', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM planes_cloud WHERE activo::text = '1' OR activo::text = 'true' ORDER BY precio_mensual");
    res.json({ planes: result.rows });
  } catch (err) {
    console.error('Error planes:', err);
    res.status(500).json({ error: 'Error obteniendo planes' });
  }
});

// GET /api/cloud/templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await proxmox.getAvailableTemplates();
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo templates de Proxmox' });
  }
});

// GET /api/cloud/mis-instancias
// SEGURIDAD: Filtra SIEMPRE por cliente_cloud_id del usuario autenticado
router.get('/mis-instancias', auth, async (req, res) => {
  try {
    // Obtener el cliente_cloud_id del usuario autenticado
    const userResult = await pool.query(
      'SELECT id FROM clientes_cloud WHERE email = $1',
      [req.user.email]
    );

    if (!userResult.rows[0]) {
      return res.json({ instancias: [] });
    }

    const cliente_cloud_id = userResult.rows[0].id;

    const result = await pool.query(`
      SELECT
        i.instancia_id,
        i.proxmox_vmid,
        i.hostname,
        i.tipo,
        i.ip_publica,
        i.ram_mb,
        i.disk_gb,
        i.cpu_cores,
        i.estado,
        i.fecha_creacion,
        i.fecha_expiracion,
        i.usuario_vps,
        i.password_vps,
        p.nombre as plan_nombre,
        p.precio_mensual
      FROM instancias_vps i
      LEFT JOIN planes_cloud p ON i.plan_id = p.plan_id
      WHERE i.cliente_cloud_id = $1
      ORDER BY i.fecha_creacion DESC
    `, [cliente_cloud_id]);

    res.json({ instancias: result.rows });
  } catch (err) {
    console.error('Error instancias:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cloud/crear-instancia - CONECTADO A PROXMOX REAL
router.post('/crear-instancia', auth, async (req, res) => {
  const { plan_id, hostname, template } = req.body;

  if (!hostname || !plan_id) {
    return res.status(400).json({ error: 'Hostname y plan_id requeridos' });
  }

  // Validar hostname: solo alfanumérico y guiones, 1-63 chars
  const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  if (!hostnameRegex.test(hostname)) {
    return res.status(400).json({ error: 'Hostname inválido. Solo letras, números y guiones (máximo 63 caracteres)' });
  }

  // Validar plan_id como entero positivo
  const planIdInt = parseInt(plan_id);
  if (isNaN(planIdInt) || planIdInt <= 0) {
    return res.status(400).json({ error: 'plan_id inválido' });
  }

  try {
    // 1. Obtener cliente_cloud_id del usuario autenticado
    const userResult = await pool.query(
      'SELECT id FROM clientes_cloud WHERE email = $1',
      [req.user.email]
    );

    if (!userResult.rows[0]) {
      return res.status(400).json({ error: 'Usuario no tiene cuenta Cloud' });
    }

    const cliente_cloud_id = userResult.rows[0].id;

    // 2. Obtener plan
    const planResult = await pool.query('SELECT * FROM planes_cloud WHERE plan_id = $1 AND activo = true', [planIdInt]);
    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plan no encontrado o inactivo' });
    }

    const plan = planResult.rows[0];

    // 3. Generar password único y seguro para esta VM
    const vmPassword = generateSecurePassword(16);

    // 4. Obtener VMID de Proxmox
    console.log('📡 Obteniendo VMID de Proxmox...');
    const vmid = await proxmox.getNextVMID();
    console.log('✅ VMID obtenido:', vmid);

    // 5. Crear en Proxmox
    console.log('🚀 Creando contenedor en Proxmox...');
    const config = {
      vmid: vmid,
      hostname: hostname,
      cores: plan.cpu_cores,
      memory: plan.ram_mb,
      disk: plan.disk_gb,
      template: template,
      tipo: plan.tipo,
      password: vmPassword // Password único para esta VM
    };

    const proxmoxResult = await proxmox.createContainer(config);
    console.log('✅ Contenedor creado en Proxmox:', proxmoxResult);

    // 6. Intentar obtener la IP real (varios reintentos para esperar DHCP)
    let ip_publica = null;
    const tipoLower = plan.tipo === 'KVM' ? 'qemu' : 'lxc';

    console.log(`⏳ Esperando asignación de IP para VMID ${vmid}...`);
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        const status = await proxmox.getStatus(vmid, tipoLower);
        console.log(`📡 Intento ${i + 1}: Status=${status.status}, IP=${status.ip_publica || 'N/A'}`);

        if (status.ip_publica) {
          ip_publica = status.ip_publica;
          console.log(`✅ ¡IP detectada!: ${ip_publica}`);
          break;
        }
      } catch (e) {
        console.log(`⚠️ Intento ${i + 1} fallido:`, e.message);
      }
    }

    // 7. Registrar en BD con el password único
    const result = await pool.query(`
      INSERT INTO instancias_vps (
        cliente_cloud_id, proxmox_vmid, tipo, hostname,
        ip_publica, ram_mb, disk_gb, cpu_cores, plan_id,
        fecha_expiracion, estado, usuario_vps, password_vps
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() + INTERVAL '30 days', 'RUNNING', 'root', $10)
      RETURNING *
    `, [cliente_cloud_id, vmid, plan.tipo, hostname, ip_publica, plan.ram_mb, plan.disk_gb, plan.cpu_cores, plan.plan_id, vmPassword]);

    res.json({
      success: true,
      instancia: result.rows[0],
      mensaje: `✅ VPS (${plan.tipo}) creado exitosamente!\nVMID: ${vmid}\nHostname: ${hostname}\n⚠️ Guarda tu contraseña ahora, la podrás ver en tu dashboard.`
    });
  } catch (err) {
    console.error('❌ Error crear instancia:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cloud/controlar/:id - CONECTADO A PROXMOX REAL
// SEGURIDAD: Verifica que la instancia pertenece al usuario autenticado
router.post('/controlar/:instancia_id', auth, async (req, res) => {
  const { instancia_id } = req.params;
  const { accion } = req.body;

  try {
    // Obtener cliente_cloud_id del usuario autenticado
    const userResult = await pool.query('SELECT id FROM clientes_cloud WHERE email = $1', [req.user.email]);
    if (!userResult.rows[0]) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const cliente_cloud_id = userResult.rows[0].id;

    // Verificar que la instancia pertenece al usuario autenticado
    const inst = await pool.query(
      'SELECT * FROM instancias_vps WHERE instancia_id = $1 AND cliente_cloud_id = $2',
      [instancia_id, cliente_cloud_id]
    );
    if (inst.rows.length === 0) {
      return res.status(404).json({ error: 'Instancia no encontrada' });
    }

    const instancia = inst.rows[0];
    const tipo = instancia.tipo === 'KVM' ? 'qemu' : 'lxc';

    console.log(`🎮 Controlando VMID ${instancia.proxmox_vmid}: ${accion}`);

    let nuevo_estado = instancia.estado;

    switch (accion) {
      case 'start':
        await proxmox.startInstance(instancia.proxmox_vmid, tipo);
        nuevo_estado = 'RUNNING';
        break;
      case 'stop':
        await proxmox.stopInstance(instancia.proxmox_vmid, tipo);
        nuevo_estado = 'STOPPED';
        break;
      case 'reboot':
        await proxmox.rebootInstance(instancia.proxmox_vmid, tipo);
        nuevo_estado = 'RUNNING';
        break;
      default:
        return res.status(400).json({ error: 'Acción inválida. Use: start, stop, reboot' });
    }

    await pool.query('UPDATE instancias_vps SET estado = $1 WHERE instancia_id = $2', [nuevo_estado, instancia_id]);

    res.json({ success: true, mensaje: `✅ Acción ${accion} ejecutada`, nuevo_estado });
  } catch (err) {
    console.error('❌ Error controlar:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cloud/eliminar/:id - CONECTADO A PROXMOX REAL
// SEGURIDAD: Verifica que la instancia pertenece al usuario autenticado
router.delete('/eliminar/:instancia_id', auth, async (req, res) => {
  const { instancia_id } = req.params;

  try {
    // Obtener cliente_cloud_id del usuario autenticado
    const userResult = await pool.query('SELECT id FROM clientes_cloud WHERE email = $1', [req.user.email]);
    if (!userResult.rows[0]) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const cliente_cloud_id = userResult.rows[0].id;

    // Verificar que la instancia pertenece al usuario autenticado
    const inst = await pool.query(
      'SELECT * FROM instancias_vps WHERE instancia_id = $1 AND cliente_cloud_id = $2',
      [instancia_id, cliente_cloud_id]
    );
    if (inst.rows.length === 0) {
      return res.status(404).json({ error: 'Instancia no encontrada' });
    }

    const instancia = inst.rows[0];
    const tipo = instancia.tipo === 'KVM' ? 'qemu' : 'lxc';

    console.log(`🗑️ Eliminando VMID ${instancia.proxmox_vmid} de Proxmox...`);

    await proxmox.deleteInstance(instancia.proxmox_vmid, tipo);
    await pool.query('DELETE FROM instancias_vps WHERE instancia_id = $1', [instancia_id]);

    res.json({ success: true, mensaje: '✅ VPS eliminado de Proxmox y base de datos' });
  } catch (err) {
    console.error('❌ Error eliminar:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cloud/console/:instancia_id - OBTENER TICKET VNC
// SEGURIDAD: Verifica que la instancia pertenece al usuario autenticado
router.get('/console/:instancia_id', auth, async (req, res) => {
  const { instancia_id } = req.params;

  try {
    const userResult = await pool.query('SELECT id FROM clientes_cloud WHERE email = $1', [req.user.email]);
    if (!userResult.rows[0]) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const cliente_cloud_id = userResult.rows[0].id;

    const inst = await pool.query(
      'SELECT * FROM instancias_vps WHERE instancia_id = $1 AND cliente_cloud_id = $2',
      [instancia_id, cliente_cloud_id]
    );
    if (inst.rows.length === 0) {
      return res.status(404).json({ error: 'Instancia no encontrada' });
    }

    const instancia = inst.rows[0];
    const tipoLower = instancia.tipo === 'KVM' ? 'qemu' : 'lxc';

    console.log(`🎟️ Solicitando ticket VNC para VMID ${instancia.proxmox_vmid}...`);
    const vncData = await proxmox.getVNCProxy(instancia.proxmox_vmid, tipoLower);

    res.json({
      success: true,
      ticket: vncData.ticket,
      port: vncData.port,
      vmid: instancia.proxmox_vmid,
      type: tipoLower,
      node: proxmox.node,
      mensaje: 'Ticket generado correctamente'
    });
  } catch (err) {
    console.error('Error ticket consola:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cloud/refrescar/:instancia_id - SINCRONIZACIÓN MANUAL
// SEGURIDAD: Verifica que la instancia pertenece al usuario autenticado
router.get('/refrescar/:instancia_id', auth, async (req, res) => {
  const { instancia_id } = req.params;

  try {
    const userResult = await pool.query('SELECT id FROM clientes_cloud WHERE email = $1', [req.user.email]);
    if (!userResult.rows[0]) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const cliente_cloud_id = userResult.rows[0].id;

    const inst = await pool.query(
      'SELECT * FROM instancias_vps WHERE instancia_id = $1 AND cliente_cloud_id = $2',
      [instancia_id, cliente_cloud_id]
    );
    if (inst.rows.length === 0) {
      return res.status(404).json({ error: 'Instancia no encontrada' });
    }

    const instancia = inst.rows[0];
    const tipoLower = instancia.tipo === 'KVM' ? 'qemu' : 'lxc';

    const status = await proxmox.getStatus(instancia.proxmox_vmid, tipoLower);

    if (status.ip_publica && status.ip_publica !== instancia.ip_publica) {
      await pool.query('UPDATE instancias_vps SET ip_publica = $1 WHERE instancia_id = $2', [status.ip_publica, instancia_id]);
      instancia.ip_publica = status.ip_publica;
    }

    res.json({
      success: true,
      live_status: status,
      db_status: instancia,
      mensaje: '✅ Datos sincronizados correctamente'
    });
  } catch (err) {
    console.error('❌ Error refrescar:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========================
// REGISTRO LEAD + OTP
// ========================
router.post('/register-lead', async (req, res) => {
  const {
    nombre, apellido, email, telefono, perfil,
    tipo_documento, documento, empresa,
    direccion, ciudad, departamento,
    plan_id, plan_name, plan_price
  } = req.body;

  if (!email || !telefono || !nombre) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const activation_code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔐 Generando OTP para ${email}`);

    const checkUser = await pool.query('SELECT id FROM clientes_cloud WHERE email = $1', [email]);

    let cliente_id;

    if (checkUser.rows.length > 0) {
      cliente_id = checkUser.rows[0].id;
      await pool.query(`
        UPDATE clientes_cloud SET
          nombre = $1, apellido = $2, telefono = $3,
          codigo_activacion = $4, estado_verificacion = 'PENDIENTE',
          empresa = $5, direccion = $6, ciudad = $7, departamento = $8,
          tipo_documento = $9, documento = $10
        WHERE id = $11
      `, [nombre, apellido, telefono, activation_code, empresa, direccion, ciudad, departamento, tipo_documento, documento, cliente_id]);
    } else {
      const insert = await pool.query(`
        INSERT INTO clientes_cloud (
          email, password_hash, nombre, apellido, telefono,
          codigo_activacion, estado_verificacion, estado,
          empresa, direccion, ciudad, departamento,
          tipo_documento, documento, saldo_creditos
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, 'PENDIENTE', 'LEAD',
          $7, $8, $9, $10,
          $11, $12, 0
        ) RETURNING id
      `, [
        email, 'auth_via_otp', nombre, apellido, telefono,
        activation_code, empresa, direccion, ciudad, departamento,
        tipo_documento, documento
      ]);
      cliente_id = insert.rows[0].id;
    }

    // Enviar a n8n
    try {
      const n8nUrl = process.env.N8N_WEBHOOK_LEAD || 'https://n8n.bigdata.net.co/webhook/bigdata-lead-vps';
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, apellido, correo: email, telefono,
          "Plan vps": plan_id || "vps-custom",
          precio: plan_price,
          compania: empresa || "Particular",
          direccion, ciudad,
          "plan name": plan_name,
          timestamp: new Date().toISOString(),
          perfil,
          activation_code,
          ip_cliente: req.ip
        })
      });
    } catch (n8nErr) {
      console.error('⚠️ Error enviando a n8n:', n8nErr.message);
    }

    res.json({ success: true, message: 'Código enviado', email });

  } catch (err) {
    console.error('❌ Error register-lead:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/validate-code', async (req, res) => {
  const { email, codigo } = req.body;

  if (!email || !codigo) {
    return res.status(400).json({ error: 'Email y código requeridos' });
  }

  try {
    const result = await pool.query(
      'SELECT id, codigo_activacion FROM clientes_cloud WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    if (String(user.codigo_activacion).trim() === String(codigo).trim()) {
      await pool.query(
        "UPDATE clientes_cloud SET estado_verificacion = 'VERIFICADO' WHERE id = $1",
        [user.id]
      );
      res.json({ success: true, message: 'Código válido' });
    } else {
      res.status(400).json({ error: 'Código incorrecto' });
    }

  } catch (err) {
    console.error('❌ Error validate-code:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

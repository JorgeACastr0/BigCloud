-- ============================================
-- SINCRONIZACIÓN DE VPS PROXMOX → POSTGRESQL (CORREGIDO)
-- ============================================
-- Ejecutar en: docker exec -it postgres-shared psql -U admin -d bigdata_isp_v2

-- 1. Ver estado actual de la tabla
SELECT 
  instancia_id,
  proxmox_vmid,
  hostname,
  tipo,
  estado,
  ram_mb,
  cpu_cores,
  disk_gb,
  plan_id
FROM instancias_vps
ORDER BY proxmox_vmid;

-- 2. Verificar que existe el cliente test
-- Nota: La columna en clientes_cloud es 'id', no 'cliente_cloud_id'
SELECT id, email FROM clientes_cloud WHERE email = 'test@bigdata.net.co';

-- 3. Crear planes si no existen (Basado en la estructura real)
INSERT INTO planes_cloud (nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, activo)
VALUES 
  ('LXC-TRIAL-512', 'LXC', 512, 10, 1, 0, true),
  ('LXC-BASIC-1GB', 'LXC', 1024, 20, 1, 15000, true),
  ('LXC-ADVANCED-4GB', 'LXC', 4096, 50, 2, 45000, true)
ON CONFLICT DO NOTHING;

-- 4. Insertar VPS existentes en Proxmox
-- Nota: ip_publica es tipo INET, usaremos NULL inicialmente.
-- Nota: fecha_expiracion es tipo DATE.

-- VPS 1: big-net.co (VMID 101)
INSERT INTO instancias_vps (
  cliente_cloud_id,
  proxmox_vmid,
  tipo,
  hostname,
  ip_publica,
  ram_mb,
  disk_gb,
  cpu_cores,
  plan_id,
  estado,
  fecha_creacion,
  fecha_expiracion
) VALUES (
  (SELECT id FROM clientes_cloud WHERE email = 'test@bigdata.net.co' LIMIT 1),
  101,
  'LXC',
  'big-net.co',
  NULL,
  4096,
  80,
  2,
  (SELECT plan_id FROM planes_cloud WHERE nombre = 'LXC-ADVANCED-4GB' LIMIT 1),
  'RUNNING',
  NOW() - INTERVAL '45 hours',
  (CURRENT_DATE + INTERVAL '30 days')::date
) ON CONFLICT (proxmox_vmid) DO UPDATE SET
  hostname = EXCLUDED.hostname,
  ram_mb = EXCLUDED.ram_mb,
  disk_gb = EXCLUDED.disk_gb,
  cpu_cores = EXCLUDED.cpu_cores,
  estado = EXCLUDED.estado;

-- VPS 2: Yaruu.com.co-ubuntu (VMID 102)
INSERT INTO instancias_vps (
  cliente_cloud_id,
  proxmox_vmid,
  tipo,
  hostname,
  ip_publica,
  ram_mb,
  disk_gb,
  cpu_cores,
  plan_id,
  estado,
  fecha_creacion,
  fecha_expiracion
) VALUES (
  (SELECT id FROM clientes_cloud WHERE email = 'test@bigdata.net.co' LIMIT 1),
  102,
  'LXC',
  'Yaruu.com.co-ubuntu',
  NULL,
  512,
  2,
  1,
  (SELECT plan_id FROM planes_cloud WHERE nombre = 'LXC-TRIAL-512' LIMIT 1),
  'RUNNING',
  NOW() - INTERVAL '43 hours',
  (CURRENT_DATE + INTERVAL '30 days')::date
) ON CONFLICT (proxmox_vmid) DO UPDATE SET
  hostname = EXCLUDED.hostname,
  ram_mb = EXCLUDED.ram_mb,
  disk_gb = EXCLUDED.disk_gb,
  cpu_cores = EXCLUDED.cpu_cores,
  estado = EXCLUDED.estado;

-- VPS 3: ns2-dns-technitiumdns (VMID 103)
INSERT INTO instancias_vps (
  cliente_cloud_id,
  proxmox_vmid,
  tipo,
  hostname,
  ip_publica,
  ram_mb,
  disk_gb,
  cpu_cores,
  plan_id,
  estado,
  fecha_creacion,
  fecha_expiracion
) VALUES (
  (SELECT id FROM clientes_cloud WHERE email = 'test@bigdata.net.co' LIMIT 1),
  103,
  'LXC',
  'ns2-dns-technitiumdns',
  NULL,
  512,
  2,
  1,
  (SELECT plan_id FROM planes_cloud WHERE nombre = 'LXC-TRIAL-512' LIMIT 1),
  'RUNNING',
  NOW() - INTERVAL '19 hours',
  (CURRENT_DATE + INTERVAL '30 days')::date
) ON CONFLICT (proxmox_vmid) DO UPDATE SET
  hostname = EXCLUDED.hostname,
  ram_mb = EXCLUDED.ram_mb,
  disk_gb = EXCLUDED.disk_gb,
  cpu_cores = EXCLUDED.cpu_cores,
  estado = EXCLUDED.estado;

-- 5. Verificar que se insertaron correctamente
SELECT 
  instancia_id,
  proxmox_vmid,
  hostname,
  estado,
  ram_mb,
  cpu_cores,
  disk_gb
FROM instancias_vps
ORDER BY proxmox_vmid;

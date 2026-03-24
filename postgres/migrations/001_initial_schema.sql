-- ============================================================
-- Migration 001: Schema inicial BigCloudMiami
-- Documenta las tablas existentes con CREATE TABLE IF NOT EXISTS
-- Es idempotente: se puede ejecutar múltiples veces sin daño
-- ============================================================

-- Tabla de clientes/usuarios
CREATE TABLE IF NOT EXISTS clientes_cloud (
    id                  SERIAL PRIMARY KEY,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       TEXT NOT NULL,
    nombre              VARCHAR(100),
    apellido            VARCHAR(100),
    telefono            VARCHAR(30),
    empresa             VARCHAR(200),
    tipo_documento      VARCHAR(20) DEFAULT 'CC',
    documento           VARCHAR(50),
    direccion           TEXT,
    ciudad              VARCHAR(100),
    departamento        VARCHAR(100),
    estado              VARCHAR(50) DEFAULT 'LEAD',
    estado_verificacion VARCHAR(50) DEFAULT 'PENDIENTE',
    codigo_activacion   VARCHAR(10),
    saldo_creditos      DECIMAL(10,2) DEFAULT 0,
    rol                 VARCHAR(20) DEFAULT 'cliente',
    fecha_creacion      TIMESTAMP DEFAULT NOW()
);

-- Tabla de planes disponibles
CREATE TABLE IF NOT EXISTS planes_cloud (
    plan_id         SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    tipo            VARCHAR(10) NOT NULL CHECK (tipo IN ('CT', 'KVM', 'LXC')),
    cpu_cores       INTEGER NOT NULL,
    ram_mb          INTEGER NOT NULL,
    disk_gb         INTEGER NOT NULL,
    precio_mensual  DECIMAL(10,2) NOT NULL,
    activo          BOOLEAN DEFAULT true,
    descripcion     TEXT,
    fecha_creacion  TIMESTAMP DEFAULT NOW()
);

-- Tabla de instancias VPS activas
CREATE TABLE IF NOT EXISTS instancias_vps (
    instancia_id        SERIAL PRIMARY KEY,
    cliente_cloud_id    INTEGER REFERENCES clientes_cloud(id) ON DELETE SET NULL,
    proxmox_vmid        INTEGER NOT NULL,
    tipo                VARCHAR(10) NOT NULL,
    hostname            VARCHAR(100) NOT NULL,
    ip_publica          VARCHAR(50),
    ram_mb              INTEGER,
    disk_gb             INTEGER,
    cpu_cores           INTEGER,
    plan_id             INTEGER REFERENCES planes_cloud(plan_id) ON DELETE SET NULL,
    estado              VARCHAR(50) DEFAULT 'CREATING',
    usuario_vps         VARCHAR(50) DEFAULT 'root',
    password_vps        TEXT,
    fecha_creacion      TIMESTAMP DEFAULT NOW(),
    fecha_expiracion    TIMESTAMP
);

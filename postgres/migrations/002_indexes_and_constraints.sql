-- ============================================================
-- Migration 002: Índices y constraints
-- Mejora el rendimiento de queries frecuentes
-- ============================================================

-- Índices en clientes_cloud
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes_cloud(email);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes_cloud(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_verificacion ON clientes_cloud(estado_verificacion);

-- Índices en instancias_vps
CREATE INDEX IF NOT EXISTS idx_instancias_cliente ON instancias_vps(cliente_cloud_id);
CREATE INDEX IF NOT EXISTS idx_instancias_vmid ON instancias_vps(proxmox_vmid);
CREATE INDEX IF NOT EXISTS idx_instancias_estado ON instancias_vps(estado);

-- Índices en planes_cloud
CREATE INDEX IF NOT EXISTS idx_planes_activo ON planes_cloud(activo);
CREATE INDEX IF NOT EXISTS idx_planes_tipo ON planes_cloud(tipo);

-- Añadir columna 'rol' a clientes_cloud si no existe
-- (usada por el middleware auth para verificar admin)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='clientes_cloud' AND column_name='rol'
    ) THEN
        ALTER TABLE clientes_cloud ADD COLUMN rol VARCHAR(20) DEFAULT 'cliente';
    END IF;
END
$$;

-- Añadir columna 'descripcion' a planes_cloud si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='planes_cloud' AND column_name='descripcion'
    ) THEN
        ALTER TABLE planes_cloud ADD COLUMN descripcion TEXT;
    END IF;
END
$$;

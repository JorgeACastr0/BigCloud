-- ============================================================
-- Migration 004: Tabla de pagos para integración Wompi
-- ============================================================

CREATE TABLE IF NOT EXISTS pagos_pendientes (
    pago_id                 SERIAL PRIMARY KEY,
    reference               VARCHAR(100) UNIQUE NOT NULL,
    cliente_cloud_id        INTEGER REFERENCES clientes_cloud(id) ON DELETE SET NULL,
    plan_id                 INTEGER REFERENCES planes_cloud(plan_id) ON DELETE SET NULL,
    instancia_id            INTEGER REFERENCES instancias_vps(instancia_id) ON DELETE SET NULL,
    monto_usd               DECIMAL(10,2),
    monto_cop               BIGINT,
    estado                  VARCHAR(50) DEFAULT 'pendiente',
    wompi_transaction_id    VARCHAR(200),
    wompi_status            VARCHAR(50),
    fecha_creacion          TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagos_reference ON pagos_pendientes(reference);
CREATE INDEX IF NOT EXISTS idx_pagos_cliente ON pagos_pendientes(cliente_cloud_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos_pendientes(estado);

-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pagos_updated_at ON pagos_pendientes;
CREATE TRIGGER update_pagos_updated_at
    BEFORE UPDATE ON pagos_pendientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

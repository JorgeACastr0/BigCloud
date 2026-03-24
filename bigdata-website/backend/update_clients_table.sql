-- ==========================================
-- ACTUALIZACIÓN DE TABLA CLIENTES_CLOUD
-- Fase 6: Registro Completo y Validación OTP
-- ==========================================

-- 1. Añadir columnas de perfil detallado
ALTER TABLE clientes_cloud 
ADD COLUMN IF NOT EXISTS apellido VARCHAR(200),
ADD COLUMN IF NOT EXISTS tipo_documento VARCHAR(10),
ADD COLUMN IF NOT EXISTS documento VARCHAR(50),
ADD COLUMN IF NOT EXISTS direccion VARCHAR(255),
ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100),
ADD COLUMN IF NOT EXISTS departamento VARCHAR(100);

-- 2. Añadir columnas para lógica de seguridad y validación
ALTER TABLE clientes_cloud 
ADD COLUMN IF NOT EXISTS codigo_activacion VARCHAR(10),
ADD COLUMN IF NOT EXISTS estado_verificacion VARCHAR(20) DEFAULT 'PENDIENTE'; -- PENDIENTE, VERIFICADO

-- 3. Hacer el email único (ya debería serlo, pero por seguridad)
-- ALTER TABLE clientes_cloud ADD CONSTRAINT unique_email UNIQUE (email);

-- 4. Comentarios para documentar
COMMENT ON COLUMN clientes_cloud.documento IS 'Número de Cédula o NIT';
COMMENT ON COLUMN clientes_cloud.codigo_activacion IS 'Código OTP de 6 dígitos para validar celular/email';

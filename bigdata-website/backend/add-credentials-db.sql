-- ============================================
-- AMPLIACIÓN DE BASE DE DATOS: CREDENCIALES
-- ============================================
-- Ejecutar en: docker exec -it postgres-shared psql -U admin -d bigdata_isp_v2

-- 1. Agregar columnas para credenciales
ALTER TABLE instancias_vps 
ADD COLUMN IF NOT EXISTS usuario_vps CHARACTER VARYING DEFAULT 'root',
ADD COLUMN IF NOT EXISTS password_vps CHARACTER VARYING;

-- 2. Actualizar el script de sincronización con las contraseñas básicas
-- (Usando 'bigdata2025' que es el default visto en el código)

UPDATE instancias_vps 
SET usuario_vps = 'root', 
    password_vps = 'bigdata2025' 
WHERE password_vps IS NULL;

-- 3. Verificar estructura final
\d instancias_vps

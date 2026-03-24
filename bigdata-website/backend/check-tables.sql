-- ============================================
-- VERIFICAR ESTRUCTURA DE TABLAS
-- ============================================
-- Ejecutar en: docker exec -it postgres-shared psql -U admin -d bigdata_isp_v2

-- 1. Ver estructura de la tabla planes_cloud
\d planes_cloud

-- 2. Ver estructura de la tabla clientes_cloud
\d clientes_cloud

-- 3. Ver estructura de la tabla instancias_vps
\d instancias_vps

-- 4. Ver todos los datos actuales de planes_cloud
SELECT * FROM planes_cloud;

-- 5. Ver todos los datos actuales de clientes_cloud
SELECT * FROM clientes_cloud;

-- 6. Ver todos los datos actuales de instancias_vps
SELECT * FROM instancias_vps;

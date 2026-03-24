-- ============================================
-- COMANDOS PARA VERIFICAR ESTRUCTURA DE TABLAS
-- ============================================
-- Ejecutar en PostgreSQL: docker exec -it postgres-shared psql -U admin -d bigdata_isp_v2

-- OPCIÓN 1: Ver estructura completa de cada tabla
\d planes_cloud
\d clientes_cloud
\d instancias_vps

-- OPCIÓN 2: Ver solo nombres de columnas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'planes_cloud' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clientes_cloud' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'instancias_vps' 
ORDER BY ordinal_position;

-- OPCIÓN 3: Ver datos actuales (para entender la estructura)
SELECT * FROM planes_cloud LIMIT 5;
SELECT * FROM clientes_cloud LIMIT 5;
SELECT * FROM instancias_vps LIMIT 5;

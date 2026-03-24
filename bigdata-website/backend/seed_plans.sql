-- Semilla de Planes Cloud (BigData ISP)
-- Estos planes reemplazan a la API de Vultr

INSERT INTO planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, activo)
VALUES 
(100, 'Hosting Web Pro', 'KVM', 2048, 20, 1, 7600, true),
(101, 'VPS Standard', 'KVM', 1024, 25, 1, 25000, true),
(102, 'Enterprise Java', 'KVM', 4096, 40, 2, 11200, true)
ON CONFLICT (plan_id) DO UPDATE 
SET nombre = EXCLUDED.nombre, precio_mensual = EXCLUDED.precio_mensual;

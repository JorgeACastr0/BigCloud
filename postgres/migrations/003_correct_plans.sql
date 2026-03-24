-- ============================================================
-- Migration 003: Planes correctos según Contexto.md
-- Elimina los 3 planes incorrectos y carga los 10 definitivos
-- ============================================================

-- Limpiar planes anteriores (los 3 incorrectos del seed viejo)
DELETE FROM planes_cloud WHERE plan_id IN (100, 101, 102);

-- También limpiar cualquier plan existente para evitar duplicados
TRUNCATE TABLE planes_cloud RESTART IDENTITY CASCADE;

-- Insertar los 10 planes definitivos de BigCloudMiami

-- ---- CT (LXC) - 5 planes ----
INSERT INTO planes_cloud (nombre, tipo, cpu_cores, ram_mb, disk_gb, precio_mensual, activo, descripcion) VALUES
('CT XS', 'CT', 1, 512,  5,  2.50, true, 'Contenedor LXC básico. Ideal para pruebas y proyectos personales.'),
('CT S',  'CT', 1, 1024, 10, 4.00, true, 'Contenedor LXC pequeño. Para sitios web simples o bots.'),
('CT M',  'CT', 2, 2048, 20, 7.00, true, 'Contenedor LXC mediano. Para aplicaciones Node.js/PHP.'),
('CT L',  'CT', 2, 4096, 40, 12.00, true, 'Contenedor LXC grande. Para bases de datos o APIs con carga moderada.'),
('CT XL', 'CT', 4, 8192, 80, 20.00, true, 'Contenedor LXC extra grande. Para servicios de producción.');

-- ---- KVM - 5 planes ----
INSERT INTO planes_cloud (nombre, tipo, cpu_cores, ram_mb, disk_gb, precio_mensual, activo, descripcion) VALUES
('KVM XS', 'KVM', 1, 1024,  20,  6.00, true, 'VM KVM básica. Aislamiento completo para proyectos con mayor seguridad.'),
('KVM S',  'KVM', 2, 2048,  40,  10.00, true, 'VM KVM pequeña. Para aplicaciones que requieren kernel propio.'),
('KVM M',  'KVM', 2, 4096,  80,  18.00, true, 'VM KVM mediana. Para servidores de juegos o aplicaciones pesadas.'),
('KVM L',  'KVM', 4, 8192,  160, 35.00, true, 'VM KVM grande. Para bases de datos en producción o ERPs.'),
('KVM XL', 'KVM', 6, 16384, 320, 65.00, true, 'VM KVM extra grande. Para workloads intensivos o múltiples servicios.');

--
-- PostgreSQL database dump
--

\restrict JnfIQwkjkaljSFYPIezfq5UKhEOePA9OVl0VZs3HCNp1Pn0zIoDIvGSpBeNolAh

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: planes_cloud; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (1, 'LXC-TRIAL-512', 'LXC', 512, 10, 1, 0.00, 0.0000, true, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (2, 'LXC-BASIC-1GB', 'LXC', 1024, 20, 1, 15000.00, 0.0208, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (3, 'LXC-STANDARD-2GB', 'LXC', 2048, 40, 2, 25000.00, 0.0347, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (4, 'KVM-STARTER-1GB', 'KVM', 1024, 25, 1, 20000.00, 0.0278, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (5, 'KVM-BASIC-2GB', 'KVM', 2048, 50, 2, 35000.00, 0.0486, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (6, 'KVM-STANDARD-4GB', 'KVM', 4096, 80, 2, 55000.00, 0.0764, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (7, 'KVM-PREMIUM-8GB', 'KVM', 8192, 160, 4, 95000.00, 0.1319, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (11, 'LXC-ADVANCED-4GB', 'LXC', 4096, 50, 2, 45000.00, NULL, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (100, 'Hosting Web Pro', 'KVM', 2048, 20, 1, 7600.00, NULL, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (101, 'VPS Standard', 'KVM', 1024, 25, 1, 25000.00, NULL, false, true);
INSERT INTO public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) VALUES (102, 'Enterprise Java', 'KVM', 4096, 40, 2, 11200.00, NULL, false, true);


--
-- Name: planes_cloud_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.planes_cloud_plan_id_seq', 14, true);


--
-- PostgreSQL database dump complete
--

\unrestrict JnfIQwkjkaljSFYPIezfq5UKhEOePA9OVl0VZs3HCNp1Pn0zIoDIvGSpBeNolAh


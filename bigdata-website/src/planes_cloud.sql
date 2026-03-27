--
-- PostgreSQL database dump
--

\restrict P950syG2QpM4tZCdCTR29OMAE3jqZBmpKCzdpNlIWaCqXYmwh8mYYsj3m7Stcrr

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: planes_cloud; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.planes_cloud (
    plan_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    tipo character varying(10),
    ram_mb integer NOT NULL,
    disk_gb integer NOT NULL,
    cpu_cores integer NOT NULL,
    precio_mensual numeric(10,2) NOT NULL,
    precio_hora numeric(10,4),
    trial_disponible boolean DEFAULT false,
    activo boolean DEFAULT true,
    CONSTRAINT planes_cloud_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['LXC'::character varying, 'KVM'::character varying])::text[])))
);


ALTER TABLE public.planes_cloud OWNER TO admin;

--
-- Name: planes_cloud_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.planes_cloud_plan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planes_cloud_plan_id_seq OWNER TO admin;

--
-- Name: planes_cloud_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.planes_cloud_plan_id_seq OWNED BY public.planes_cloud.plan_id;


--
-- Name: planes_cloud plan_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.planes_cloud ALTER COLUMN plan_id SET DEFAULT nextval('public.planes_cloud_plan_id_seq'::regclass);


--
-- Data for Name: planes_cloud; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.planes_cloud (plan_id, nombre, tipo, ram_mb, disk_gb, cpu_cores, precio_mensual, precio_hora, trial_disponible, activo) FROM stdin;
1	LXC-TRIAL-512	LXC	512	10	1	0.00	0.0000	t	t
2	LXC-BASIC-1GB	LXC	1024	20	1	15000.00	0.0208	f	t
3	LXC-STANDARD-2GB	LXC	2048	40	2	25000.00	0.0347	f	t
4	KVM-STARTER-1GB	KVM	1024	25	1	20000.00	0.0278	f	t
5	KVM-BASIC-2GB	KVM	2048	50	2	35000.00	0.0486	f	t
6	KVM-STANDARD-4GB	KVM	4096	80	2	55000.00	0.0764	f	t
7	KVM-PREMIUM-8GB	KVM	8192	160	4	95000.00	0.1319	f	t
11	LXC-ADVANCED-4GB	LXC	4096	50	2	45000.00	\N	f	t
100	Hosting Web Pro	KVM	2048	20	1	7600.00	\N	f	t
101	VPS Standard	KVM	1024	25	1	25000.00	\N	f	t
102	Enterprise Java	KVM	4096	40	2	11200.00	\N	f	t
\.


--
-- Name: planes_cloud_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.planes_cloud_plan_id_seq', 14, true);


--
-- Name: planes_cloud planes_cloud_nombre_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.planes_cloud
    ADD CONSTRAINT planes_cloud_nombre_key UNIQUE (nombre);


--
-- Name: planes_cloud planes_cloud_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.planes_cloud
    ADD CONSTRAINT planes_cloud_pkey PRIMARY KEY (plan_id);


--
-- PostgreSQL database dump complete
--

\unrestrict P950syG2QpM4tZCdCTR29OMAE3jqZBmpKCzdpNlIWaCqXYmwh8mYYsj3m7Stcrr


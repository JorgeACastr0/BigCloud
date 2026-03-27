--
-- PostgreSQL database dump
--

\restrict H57Uh3Ti4eQphYZXAbltrerLZvO6ailmImYeqLIarYhNuAeFSb4SCt9uHrcU2Pc

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

\unrestrict H57Uh3Ti4eQphYZXAbltrerLZvO6ailmImYeqLIarYhNuAeFSb4SCt9uHrcU2Pc


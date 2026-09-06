--
-- PostgreSQL database cluster dump
--

-- Started on 2026-09-06 12:20:16 UTC

\restrict mgYc9Y4KGAOvvcg5h532E3tt7MFgAs1whBZCf1tNcwoauIxlM2OvDsnorWX5eid

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE cosmetic_admin;
ALTER ROLE cosmetic_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:RZicxizV/yibKCtEgpDPeQ==$0zV7HYBxoN5UU3dYfrfrYIyjbEdT81OHyGvFm4rtRUQ=:7h+kPqC1Z6af7IVEjCKNsFvbRWJm57QuMOz4k7USlFU=';
CREATE ROLE cosmetic_auth;
ALTER ROLE cosmetic_auth WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:npVFaFE8JzNEx4dzy3L5qQ==$4xqe9nlLKLiNoGxr1jZqVTO4pPiUsvQILATXwBi2pbk=:xspFrA3kggVHgx6h4gTm0nJkTTHuli/XICZITZi2QCI=';
CREATE ROLE cosmetic_authorization;
ALTER ROLE cosmetic_authorization WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:uegtKYp6ygxqgNdxtWmsEA==$IG8HS/89qiAah5r17MHy3Jr2HuA+9bx4pGyCyV738Cs=:46+iseAb16eqx0VJkA3RrcMNWIh5NsvGz3mYVo4r5Q4=';
CREATE ROLE cosmetic_basket;
ALTER ROLE cosmetic_basket WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:bxZ7vw0czEj69oGOjJf9Lg==$KVBW9RmloJTTh/VTYWBE54/x5P3AHHXqUzqKauyQWWo=:3zapNw0W3kSJHmB31qE07RDFqhXxiwWh5VrqEEnnNlw=';
CREATE ROLE cosmetic_category;
ALTER ROLE cosmetic_category WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:imL8Q4DZf5jf33cAyxwiuw==$6zTPa8HQXwvkB5g4DdD1DxeE4OAp0HkshvN6YMnpAto=:MglcxJfmHVRFqM7PO11WkIksgzfE1BB5vy2roaBcY40=';
CREATE ROLE cosmetic_cosmetic;
ALTER ROLE cosmetic_cosmetic WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:skRbCd5phoaF1KUt+ZgjKw==$ySWx4Ffi+43OF2wOM0oZa8mC1EfLksdx22ctFeI/qsc=:D2VYG7OKJXjogMTQCt2+0PvUiSc/BY/lbcj3aQpTOoc=';
CREATE ROLE cosmetic_customer;
ALTER ROLE cosmetic_customer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:lEK3k64XoI1HUd2i0Zwv6A==$c/OHRR/Tmm1Nc34KV4HHWzllaLiED3d7l06uXtjTWaI=:z3Nn3N1c6xMD4mrT0P4ratMB4WD1d9JYhpfeZ9fPIjs=';
CREATE ROLE cosmetic_department;
ALTER ROLE cosmetic_department WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:+/biwJECM83iI+GXnWMPYw==$HA2W0A1RqJOwcDkmAn9PrIjTpkUv4di9aPceWZOtfkE=:sfJuen5NMKgWwvTYZ2RIvFJQqp62rKEOVIYZYs/D4oA=';
CREATE ROLE cosmetic_employee;
ALTER ROLE cosmetic_employee WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:bXCll/+ODqLIXe8eB3IGKg==$eCk533AIOCjEcevrCGeoQ5nx0vaOb+suyEIVHzjszW0=:bLHdpLlBfYypQM8bsL0do8XmdfWmcDU7rqrejDuD99k=';
CREATE ROLE cosmetic_inventory;
ALTER ROLE cosmetic_inventory WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:XzCQEf9/zMf0jIkJLsO4gg==$x+tTcrkOKiKK/CnUZyuPMUzlYzrZAW2qHvIarz0X2pQ=:PIMu4jXIHxxL8Om8zNUYajTXlWqG+bPz9prd0cbP3WA=';
CREATE ROLE cosmetic_invoice;
ALTER ROLE cosmetic_invoice WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:3WSn9yXSy5rDSl18M2wE0Q==$GPNpOBHWABY4O2OldQhkoyqrPHb6k5kyjZlOKHrZLi4=:S0anzYXk+Htf+N5KzqhwkrP6BGKKJU1o3pWS7ZXjeec=';
CREATE ROLE cosmetic_order;
ALTER ROLE cosmetic_order WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:v5TsQSU16p32h8GqaTxdCA==$3++N+SwUw7BWYvoClY15juSuPCzkRKT65WJmN/lTqEg=:ySD4NoAquqdGoVyecFw2gv9Jr6ghZOUYoZ8Z6HtH4ts=';
CREATE ROLE cosmetic_purchase;
ALTER ROLE cosmetic_purchase WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:UoUq3qO0Zmsuw4zgctDBjA==$Lt0nqTdXSlgbcBsoCrw81QvykyqyG01dwA0BBLAZf34=:GRcZ5L7c0tl0+z1dsQHYBAIPgA/CwStOH2/i/qByP90=';
CREATE ROLE cosmetic_supplier;
ALTER ROLE cosmetic_supplier WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:NgK/ktoYDB9pX5N3LWwavA==$6lxJ08Jg5KMGhyBfCe00TxDvL3MRmhS2mQ0K7A1/QSw=:sr1RvU2Yfw07atRf+KDPKEdQtIIlw85v3ZNTueZGU0k=';
CREATE ROLE cosmetic_user;
ALTER ROLE cosmetic_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:1eiFWFkHyqhD+JBV7cSFTQ==$9OufshXcu+Sgpg8FKLnJe1wMRlCSBx6Va7pIyyJno0w=:ChUYSh/l8xfuKoWGvLJuVzBddzUS1uXHZdqWb2+6paU=';

--
-- User Configurations
--








\unrestrict mgYc9Y4KGAOvvcg5h532E3tt7MFgAs1whBZCf1tNcwoauIxlM2OvDsnorWX5eid

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict sLBvqkAooTq9T7Rh3bnyfCKVeoBmUC3924otXY6mr5ShK0ANEC8bWd26s3ThFtK

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:16 UTC

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

-- Completed on 2026-09-06 12:20:16 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict sLBvqkAooTq9T7Rh3bnyfCKVeoBmUC3924otXY6mr5ShK0ANEC8bWd26s3ThFtK

--
-- Database "cosmetic_authentication_service" dump
--

--
-- PostgreSQL database dump
--

\restrict 1eT8LsSeSHx3teydNeN9zgPZ9r25scL0HBhoKb11UT4yEtsaG3E2bcOO8cAqq3C

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:16 UTC

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
-- TOC entry 3467 (class 1262 OID 16399)
-- Name: cosmetic_authentication_service; Type: DATABASE; Schema: -; Owner: cosmetic_auth
--

CREATE DATABASE cosmetic_authentication_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_authentication_service OWNER TO cosmetic_auth;

\unrestrict 1eT8LsSeSHx3teydNeN9zgPZ9r25scL0HBhoKb11UT4yEtsaG3E2bcOO8cAqq3C
\connect cosmetic_authentication_service
\restrict 1eT8LsSeSHx3teydNeN9zgPZ9r25scL0HBhoKb11UT4yEtsaG3E2bcOO8cAqq3C

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
-- TOC entry 217 (class 1259 OID 16448)
-- Name: auth_users; Type: TABLE; Schema: public; Owner: cosmetic_auth
--

CREATE TABLE public.auth_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    password character varying(255) NOT NULL,
    email_verified_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_users OWNER TO cosmetic_auth;

--
-- TOC entry 216 (class 1259 OID 16441)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_auth
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_auth;

--
-- TOC entry 215 (class 1259 OID 16440)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_auth
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_auth;

--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_auth
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 3307 (class 2604 OID 16444)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_auth
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3461 (class 0 OID 16448)
-- Dependencies: 217
-- Data for Name: auth_users; Type: TABLE DATA; Schema: public; Owner: cosmetic_auth
--

COPY public.auth_users (id, user_id, password, email_verified_at, created_at, updated_at) FROM stdin;
d314129e-9704-489a-9c5b-56502d10f176	a4543a25-f93c-448d-a0a9-30ebb042445f	$2b$10$2wk5lJkhY75gqHrbG3ya1eXKv80Xsj9Cra9HoU3An0.W2VJ9Mp.1G	\N	2026-09-06 06:25:13.778+00	2026-09-06 06:25:13.778+00
e40cb635-4cf4-4080-888e-7d402cdc7698	693256c5-c87d-4d49-99e6-ac4ca0a4a86a	$2b$10$ZQIP1HsW8OAA0gxDrPgo2uCleL109J16Nh7EXXcczIIo6RPWGm80W	\N	2026-09-06 06:53:44.091+00	2026-09-06 06:53:44.091+00
71dd3a44-2948-440b-93c9-b994a851c1ef	62851176-a6bc-483b-9552-364872daec6a	$2b$10$B1tJLRSQEOcYYdyK/QWn6e1NO35.WqU.mtpN.pFDPOSjfWZMaO1gK	\N	2026-09-06 07:04:34.814+00	2026-09-06 07:04:34.814+00
b7de74c7-acf1-488c-bdca-3b0dd4fda70a	f7427d13-270e-4cd5-876e-f6d24d232994	$2b$10$kf4ax9NDh57vE0amV0Sk7Oi0QWIvGAYvCC/7wDtYM.Ig6qWxaxPZy	\N	2026-09-06 09:38:28.708+00	2026-09-06 09:38:28.708+00
62d7406f-f4d4-407e-a413-6c78986c522d	c748da0d-6ba4-4733-bcdc-a95e694142ab	$2b$10$KsoJaFwJcg3LSCUDhlabLOPvqviC7WCXzkZaYRuQAoKtIt4FeM80e	\N	2026-09-06 09:40:04.182+00	2026-09-06 09:40:04.182+00
928693d5-7581-421b-aef3-7fd1d923500a	bc929dea-180d-4ed1-8b6e-fa1a4f2c2448	$2b$10$//W/qP5BX5e9gzDvpJL3veDT1PLHABoNRvvzno3IXS1XmOaJXt0.6	\N	2026-09-06 11:08:20.135+00	2026-09-06 11:08:20.135+00
83867738-707e-499c-838d-bb3e7e74f514	d4246712-f7cb-49e9-bafc-9dfb7075f0e1	$2b$10$OtZTOyoK8sn7a4Rhn4gzf.rohH3M7nohQEeIAbVjYDYkRMbKEuyRG	\N	2026-09-06 11:10:09.103+00	2026-09-06 11:10:09.103+00
\.


--
-- TOC entry 3460 (class 0 OID 16441)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_auth
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260819093223_create_auth_users_table	2026-09-05 12:20:13.966065+00
\.


--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_auth
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3313 (class 2606 OID 16453)
-- Name: auth_users auth_users_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_auth
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3315 (class 2606 OID 16455)
-- Name: auth_users auth_users_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_auth
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_user_id_unique UNIQUE (user_id);


--
-- TOC entry 3311 (class 2606 OID 16447)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_auth
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_auth;


--
-- TOC entry 2043 (class 826 OID 16415)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_auth;


--
-- TOC entry 2042 (class 826 OID 16414)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_auth;


-- Completed on 2026-09-06 12:20:16 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict 1eT8LsSeSHx3teydNeN9zgPZ9r25scL0HBhoKb11UT4yEtsaG3E2bcOO8cAqq3C

--
-- Database "cosmetic_authorization_service" dump
--

--
-- PostgreSQL database dump
--

\restrict 2lfQjrES4smlGDvwa6b2zzpXUl5MAuaryI8mafxTmtVP8TtMkPhuzc9iQEaE63F

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:16 UTC

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
-- TOC entry 3464 (class 1262 OID 16400)
-- Name: cosmetic_authorization_service; Type: DATABASE; Schema: -; Owner: cosmetic_authorization
--

CREATE DATABASE cosmetic_authorization_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_authorization_service OWNER TO cosmetic_authorization;

\unrestrict 2lfQjrES4smlGDvwa6b2zzpXUl5MAuaryI8mafxTmtVP8TtMkPhuzc9iQEaE63F
\connect cosmetic_authorization_service
\restrict 2lfQjrES4smlGDvwa6b2zzpXUl5MAuaryI8mafxTmtVP8TtMkPhuzc9iQEaE63F

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
-- TOC entry 216 (class 1259 OID 16457)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_authorization
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_authorization;

--
-- TOC entry 215 (class 1259 OID 16456)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_authorization
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_authorization;

--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_authorization
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 217 (class 1259 OID 16464)
-- Name: roles; Type: TABLE; Schema: public; Owner: cosmetic_authorization
--

CREATE TABLE public.roles (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO cosmetic_authorization;

--
-- TOC entry 3307 (class 2604 OID 16460)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_authorization
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3457 (class 0 OID 16457)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_authorization
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260822085719_create_roles_table	2026-09-05 12:20:15.161224+00
\.


--
-- TOC entry 3458 (class 0 OID 16464)
-- Dependencies: 217
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: cosmetic_authorization
--

COPY public.roles (id, name) FROM stdin;
admin	Admin
employee	Employee
customer	Customer
\.


--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_authorization
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3310 (class 2606 OID 16463)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_authorization
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3312 (class 2606 OID 16470)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_authorization
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_authorization;


--
-- TOC entry 2043 (class 826 OID 16417)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_authorization;


--
-- TOC entry 2042 (class 826 OID 16416)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_authorization;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict 2lfQjrES4smlGDvwa6b2zzpXUl5MAuaryI8mafxTmtVP8TtMkPhuzc9iQEaE63F

--
-- Database "cosmetic_basket_service" dump
--

--
-- PostgreSQL database dump
--

\restrict 25YVz7ECM2EpgIDROr2Z42KZisqIl7pAP95uMQL3kamFlO1lnAwxh5geRkNFI34

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3481 (class 1262 OID 16411)
-- Name: cosmetic_basket_service; Type: DATABASE; Schema: -; Owner: cosmetic_basket
--

CREATE DATABASE cosmetic_basket_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_basket_service OWNER TO cosmetic_basket;

\unrestrict 25YVz7ECM2EpgIDROr2Z42KZisqIl7pAP95uMQL3kamFlO1lnAwxh5geRkNFI34
\connect cosmetic_basket_service
\restrict 25YVz7ECM2EpgIDROr2Z42KZisqIl7pAP95uMQL3kamFlO1lnAwxh5geRkNFI34

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
-- TOC entry 218 (class 1259 OID 16491)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: cosmetic_basket
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cart_id uuid NOT NULL,
    variant_id character varying(255) NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO cosmetic_basket;

--
-- TOC entry 217 (class 1259 OID 16479)
-- Name: carts; Type: TABLE; Schema: public; Owner: cosmetic_basket
--

CREATE TABLE public.carts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'OPEN'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT carts_status_check CHECK (((status)::text = ANY ((ARRAY['OPEN'::character varying, 'CHECKED_OUT'::character varying])::text[])))
);


ALTER TABLE public.carts OWNER TO cosmetic_basket;

--
-- TOC entry 216 (class 1259 OID 16472)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_basket
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_basket;

--
-- TOC entry 215 (class 1259 OID 16471)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_basket
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_basket;

--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_basket
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 3311 (class 2604 OID 16475)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_basket
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3475 (class 0 OID 16491)
-- Dependencies: 218
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: cosmetic_basket
--

COPY public.cart_items (id, cart_id, variant_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3474 (class 0 OID 16479)
-- Dependencies: 217
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: cosmetic_basket
--

COPY public.carts (id, customer_id, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3473 (class 0 OID 16472)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_basket
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260905160000	2026-09-05 12:20:16.328203+00
\.


--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_basket
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3325 (class 2606 OID 16503)
-- Name: cart_items cart_items_cart_id_variant_id_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_basket
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_variant_id_unique UNIQUE (cart_id, variant_id);


--
-- TOC entry 3327 (class 2606 OID 16496)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_basket
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3321 (class 2606 OID 16489)
-- Name: carts carts_customer_id_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_basket
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_unique UNIQUE (customer_id);


--
-- TOC entry 3323 (class 2606 OID 16487)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_basket
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 3319 (class 2606 OID 16478)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_basket
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3328 (class 2606 OID 16497)
-- Name: cart_items cart_items_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_basket
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_basket;


--
-- TOC entry 2047 (class 826 OID 16439)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_basket;


--
-- TOC entry 2046 (class 826 OID 16438)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_basket;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict 25YVz7ECM2EpgIDROr2Z42KZisqIl7pAP95uMQL3kamFlO1lnAwxh5geRkNFI34

--
-- Database "cosmetic_category_service" dump
--

--
-- PostgreSQL database dump
--

\restrict W3hG9Vf8fdJSVimorprXABVfRpbiovKIhXasmR8KY9qb9uwuAOSF30zWdghAeLY

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3468 (class 1262 OID 16404)
-- Name: cosmetic_category_service; Type: DATABASE; Schema: -; Owner: cosmetic_category
--

CREATE DATABASE cosmetic_category_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_category_service OWNER TO cosmetic_category;

\unrestrict W3hG9Vf8fdJSVimorprXABVfRpbiovKIhXasmR8KY9qb9uwuAOSF30zWdghAeLY
\connect cosmetic_category_service
\restrict W3hG9Vf8fdJSVimorprXABVfRpbiovKIhXasmR8KY9qb9uwuAOSF30zWdghAeLY

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
-- TOC entry 217 (class 1259 OID 16513)
-- Name: categories; Type: TABLE; Schema: public; Owner: cosmetic_category
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO cosmetic_category;

--
-- TOC entry 216 (class 1259 OID 16506)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_category
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_category;

--
-- TOC entry 215 (class 1259 OID 16505)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_category
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_category;

--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_category
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 3307 (class 2604 OID 16509)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_category
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3462 (class 0 OID 16513)
-- Dependencies: 217
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: cosmetic_category
--

COPY public.categories (id, name, description, is_active, created_at, updated_at) FROM stdin;
68deec87-324e-41fd-9a46-db22248b2662	cate123	21paosdjaspdodsa	t	2026-09-06 11:08:54.15+00	2026-09-06 11:08:54.15+00
\.


--
-- TOC entry 3461 (class 0 OID 16506)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_category
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260904164533	2026-09-05 12:20:17.735426+00
\.


--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_category
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3314 (class 2606 OID 16523)
-- Name: categories categories_name_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_category
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_unique UNIQUE (name);


--
-- TOC entry 3316 (class 2606 OID 16521)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_category
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3312 (class 2606 OID 16512)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_category
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_category;


--
-- TOC entry 2043 (class 826 OID 16425)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_category;


--
-- TOC entry 2042 (class 826 OID 16424)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_category;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict W3hG9Vf8fdJSVimorprXABVfRpbiovKIhXasmR8KY9qb9uwuAOSF30zWdghAeLY

--
-- Database "cosmetic_cosmetic_service" dump
--

--
-- PostgreSQL database dump
--

\restrict HjCY1b15HenoAMOgJeghfFGFEbntB4sNwm02gZZX1QIIW1FqvaImHgouvUbna6p

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3489 (class 1262 OID 16406)
-- Name: cosmetic_cosmetic_service; Type: DATABASE; Schema: -; Owner: cosmetic_cosmetic
--

CREATE DATABASE cosmetic_cosmetic_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_cosmetic_service OWNER TO cosmetic_cosmetic;

\unrestrict HjCY1b15HenoAMOgJeghfFGFEbntB4sNwm02gZZX1QIIW1FqvaImHgouvUbna6p
\connect cosmetic_cosmetic_service
\restrict HjCY1b15HenoAMOgJeghfFGFEbntB4sNwm02gZZX1QIIW1FqvaImHgouvUbna6p

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
-- TOC entry 218 (class 1259 OID 16543)
-- Name: cosmetic_categories; Type: TABLE; Schema: public; Owner: cosmetic_cosmetic
--

CREATE TABLE public.cosmetic_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cosmetic_id uuid NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.cosmetic_categories OWNER TO cosmetic_cosmetic;

--
-- TOC entry 219 (class 1259 OID 16549)
-- Name: cosmetic_variants; Type: TABLE; Schema: public; Owner: cosmetic_cosmetic
--

CREATE TABLE public.cosmetic_variants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cosmetic_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    color character varying(255),
    volume character varying(255),
    price numeric(12,2) NOT NULL,
    cost_price numeric(12,2),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT cosmetic_variants_cost_price_check CHECK ((cost_price >= (0)::numeric)),
    CONSTRAINT cosmetic_variants_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.cosmetic_variants OWNER TO cosmetic_cosmetic;

--
-- TOC entry 217 (class 1259 OID 16532)
-- Name: cosmetics; Type: TABLE; Schema: public; Owner: cosmetic_cosmetic
--

CREATE TABLE public.cosmetics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    brand character varying(255),
    origin character varying(255),
    description character varying(1000),
    image_url character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.cosmetics OWNER TO cosmetic_cosmetic;

--
-- TOC entry 216 (class 1259 OID 16525)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_cosmetic
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_cosmetic;

--
-- TOC entry 215 (class 1259 OID 16524)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_cosmetic
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_cosmetic;

--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_cosmetic
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 3315 (class 2604 OID 16528)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_cosmetic
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3482 (class 0 OID 16543)
-- Dependencies: 218
-- Data for Name: cosmetic_categories; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

COPY public.cosmetic_categories (id, cosmetic_id, category_id, created_at) FROM stdin;
77df6584-0724-4fbb-846b-63150eac704f	b158a2c6-8dad-4990-8871-10799d44b576	68deec87-324e-41fd-9a46-db22248b2662	2026-09-06 12:00:00.094+00
\.


--
-- TOC entry 3483 (class 0 OID 16549)
-- Dependencies: 219
-- Data for Name: cosmetic_variants; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

COPY public.cosmetic_variants (id, cosmetic_id, name, color, volume, price, cost_price, is_active, created_at, updated_at) FROM stdin;
b18be490-c45c-4908-8e88-c143f1ba407a	b158a2c6-8dad-4990-8871-10799d44b576	a	red	50	1000000.00	800000.00	t	2026-09-06 12:00:00.093+00	2026-09-06 12:00:00.093+00
\.


--
-- TOC entry 3481 (class 0 OID 16532)
-- Dependencies: 217
-- Data for Name: cosmetics; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

COPY public.cosmetics (id, code, name, brand, origin, description, image_url, is_active, created_at, updated_at) FROM stdin;
b158a2c6-8dad-4990-8871-10799d44b576	SP_00001	SUP1	abc	Vietnam	áđâsđâsdsađasad	aaaaaaaaaaaaaaaaa.com	t	2026-09-06 12:00:00.092+00	2026-09-06 12:00:00.092+00
\.


--
-- TOC entry 3480 (class 0 OID 16525)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260904171656	2026-09-05 12:20:18.875627+00
\.


--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_cosmetic
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3331 (class 2606 OID 16548)
-- Name: cosmetic_categories cosmetic_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_cosmetic
--

ALTER TABLE ONLY public.cosmetic_categories
    ADD CONSTRAINT cosmetic_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3333 (class 2606 OID 16557)
-- Name: cosmetic_variants cosmetic_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_cosmetic
--

ALTER TABLE ONLY public.cosmetic_variants
    ADD CONSTRAINT cosmetic_variants_pkey PRIMARY KEY (id);


--
-- TOC entry 3327 (class 2606 OID 16542)
-- Name: cosmetics cosmetics_code_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_cosmetic
--

ALTER TABLE ONLY public.cosmetics
    ADD CONSTRAINT cosmetics_code_unique UNIQUE (code);


--
-- TOC entry 3329 (class 2606 OID 16540)
-- Name: cosmetics cosmetics_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_cosmetic
--

ALTER TABLE ONLY public.cosmetics
    ADD CONSTRAINT cosmetics_pkey PRIMARY KEY (id);


--
-- TOC entry 3325 (class 2606 OID 16531)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_cosmetic
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3334 (class 2606 OID 16558)
-- Name: cosmetic_categories cosmetic_categories_cosmetic_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_cosmetic
--

ALTER TABLE ONLY public.cosmetic_categories
    ADD CONSTRAINT cosmetic_categories_cosmetic_id_foreign FOREIGN KEY (cosmetic_id) REFERENCES public.cosmetics(id) ON DELETE CASCADE;


--
-- TOC entry 3335 (class 2606 OID 16563)
-- Name: cosmetic_variants cosmetic_variants_cosmetic_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_cosmetic
--

ALTER TABLE ONLY public.cosmetic_variants
    ADD CONSTRAINT cosmetic_variants_cosmetic_id_foreign FOREIGN KEY (cosmetic_id) REFERENCES public.cosmetics(id) ON DELETE CASCADE;


--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_cosmetic;


--
-- TOC entry 2051 (class 826 OID 16429)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_cosmetic;


--
-- TOC entry 2050 (class 826 OID 16428)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_cosmetic;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict HjCY1b15HenoAMOgJeghfFGFEbntB4sNwm02gZZX1QIIW1FqvaImHgouvUbna6p

--
-- Database "cosmetic_customer_service" dump
--

--
-- PostgreSQL database dump
--

\restrict MQ5BFaFZADvDYszbal4xhuN6Ywn59YvoLWmrdFPnLcECC0WUsGrVWaP7v9PycSk

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3489 (class 1262 OID 16403)
-- Name: cosmetic_customer_service; Type: DATABASE; Schema: -; Owner: cosmetic_customer
--

CREATE DATABASE cosmetic_customer_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_customer_service OWNER TO cosmetic_customer;

\unrestrict MQ5BFaFZADvDYszbal4xhuN6Ywn59YvoLWmrdFPnLcECC0WUsGrVWaP7v9PycSk
\connect cosmetic_customer_service
\restrict MQ5BFaFZADvDYszbal4xhuN6Ywn59YvoLWmrdFPnLcECC0WUsGrVWaP7v9PycSk

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
-- TOC entry 218 (class 1259 OID 16590)
-- Name: addresses; Type: TABLE; Schema: public; Owner: cosmetic_customer
--

CREATE TABLE public.addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    city character varying(255) NOT NULL,
    street character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.addresses OWNER TO cosmetic_customer;

--
-- TOC entry 217 (class 1259 OID 16578)
-- Name: customers; Type: TABLE; Schema: public; Owner: cosmetic_customer
--

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.customers OWNER TO cosmetic_customer;

--
-- TOC entry 216 (class 1259 OID 16571)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_customer
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_customer;

--
-- TOC entry 215 (class 1259 OID 16570)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_customer
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_customer;

--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_customer
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 219 (class 1259 OID 16598)
-- Name: phones; Type: TABLE; Schema: public; Owner: cosmetic_customer
--

CREATE TABLE public.phones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    phone character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.phones OWNER TO cosmetic_customer;

--
-- TOC entry 3315 (class 2604 OID 16574)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3482 (class 0 OID 16590)
-- Dependencies: 218
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: cosmetic_customer
--

COPY public.addresses (id, customer_id, city, street, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3481 (class 0 OID 16578)
-- Dependencies: 217
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: cosmetic_customer
--

COPY public.customers (id, user_id, code, created_at, updated_at) FROM stdin;
d619f5a1-1210-4196-aae4-dd86b8309edf	693256c5-c87d-4d49-99e6-ac4ca0a4a86a	CUS-1691646F	2026-09-06 06:53:44.148+00	2026-09-06 06:53:44.148+00
7c44713b-5bf6-40f8-8695-732ff8b3f7ae	62851176-a6bc-483b-9552-364872daec6a	CUS-A00E4A9F	2026-09-06 07:04:34.832+00	2026-09-06 07:04:34.832+00
\.


--
-- TOC entry 3480 (class 0 OID 16571)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_customer
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260901085128	2026-09-05 12:20:20.069993+00
\.


--
-- TOC entry 3483 (class 0 OID 16598)
-- Dependencies: 219
-- Data for Name: phones; Type: TABLE DATA; Schema: public; Owner: cosmetic_customer
--

COPY public.phones (id, customer_id, phone, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_customer
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3329 (class 2606 OID 16597)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 16589)
-- Name: customers customers_code_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_code_unique UNIQUE (code);


--
-- TOC entry 3325 (class 2606 OID 16585)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3327 (class 2606 OID 16587)
-- Name: customers customers_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_unique UNIQUE (user_id);


--
-- TOC entry 3321 (class 2606 OID 16577)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3331 (class 2606 OID 16605)
-- Name: phones phones_phone_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_phone_unique UNIQUE (phone);


--
-- TOC entry 3333 (class 2606 OID 16603)
-- Name: phones phones_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_pkey PRIMARY KEY (id);


--
-- TOC entry 3334 (class 2606 OID 16606)
-- Name: addresses addresses_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- TOC entry 3335 (class 2606 OID 16611)
-- Name: phones phones_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_customer
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_customer;


--
-- TOC entry 2051 (class 826 OID 16423)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_customer;


--
-- TOC entry 2050 (class 826 OID 16422)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_customer;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict MQ5BFaFZADvDYszbal4xhuN6Ywn59YvoLWmrdFPnLcECC0WUsGrVWaP7v9PycSk

--
-- Database "cosmetic_department_service" dump
--

--
-- PostgreSQL database dump
--

\restrict GQDCxv9jDacRbxljAWrb8OnZECLiE4sC7pSdY4sSINiegR7bjPoS4AB9KmLO5zj

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3470 (class 1262 OID 16401)
-- Name: cosmetic_department_service; Type: DATABASE; Schema: -; Owner: cosmetic_department
--

CREATE DATABASE cosmetic_department_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_department_service OWNER TO cosmetic_department;

\unrestrict GQDCxv9jDacRbxljAWrb8OnZECLiE4sC7pSdY4sSINiegR7bjPoS4AB9KmLO5zj
\connect cosmetic_department_service
\restrict GQDCxv9jDacRbxljAWrb8OnZECLiE4sC7pSdY4sSINiegR7bjPoS4AB9KmLO5zj

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
-- TOC entry 217 (class 1259 OID 16624)
-- Name: departments; Type: TABLE; Schema: public; Owner: cosmetic_department
--

CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    manager_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    code character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.departments OWNER TO cosmetic_department;

--
-- TOC entry 216 (class 1259 OID 16617)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_department
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_department;

--
-- TOC entry 215 (class 1259 OID 16616)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_department
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_department;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_department
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 3307 (class 2604 OID 16620)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_department
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3464 (class 0 OID 16624)
-- Dependencies: 217
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: cosmetic_department
--

COPY public.departments (id, name, manager_id, created_at, updated_at, code, is_active) FROM stdin;
ba794014-91d9-459b-aa0f-83d330313947	Công nghệ thông tin	\N	2026-09-06 06:20:01.257+00	2026-09-06 06:20:01.257+00	IT	t
95dcaa9a-52b4-4aac-8d93-4a3a1a62c1f6	Kho	\N	2026-09-06 09:22:17.75+00	2026-09-06 09:22:17.75+00	warehouse	t
d37b1cc6-48e6-445a-b3b4-518d72fd3bc7	Kinh Doanh	\N	2026-09-06 11:07:01.736+00	2026-09-06 11:07:01.736+00	sales	t
\.


--
-- TOC entry 3463 (class 0 OID 16617)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_department
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260824150322	2026-09-05 12:20:21.207467+00
2	Migration20260824162437	2026-09-05 12:20:21.207467+00
\.


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_department
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);


--
-- TOC entry 3314 (class 2606 OID 16636)
-- Name: departments departments_code_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_department
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_unique UNIQUE (code);


--
-- TOC entry 3316 (class 2606 OID 16633)
-- Name: departments departments_name_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_department
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_unique UNIQUE (name);


--
-- TOC entry 3318 (class 2606 OID 16631)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_department
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 3312 (class 2606 OID 16623)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_department
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_department;


--
-- TOC entry 2043 (class 826 OID 16419)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_department;


--
-- TOC entry 2042 (class 826 OID 16418)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_department;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict GQDCxv9jDacRbxljAWrb8OnZECLiE4sC7pSdY4sSINiegR7bjPoS4AB9KmLO5zj

--
-- Database "cosmetic_employee_service" dump
--

--
-- PostgreSQL database dump
--

\restrict S0aTRBPKAwua1oEkIWuGfJUi4tJmkL9MZDrfA1kyGfGQhBzDEL8iRTsvlzGzwjV

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3472 (class 1262 OID 16402)
-- Name: cosmetic_employee_service; Type: DATABASE; Schema: -; Owner: cosmetic_employee
--

CREATE DATABASE cosmetic_employee_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_employee_service OWNER TO cosmetic_employee;

\unrestrict S0aTRBPKAwua1oEkIWuGfJUi4tJmkL9MZDrfA1kyGfGQhBzDEL8iRTsvlzGzwjV
\connect cosmetic_employee_service
\restrict S0aTRBPKAwua1oEkIWuGfJUi4tJmkL9MZDrfA1kyGfGQhBzDEL8iRTsvlzGzwjV

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
-- TOC entry 217 (class 1259 OID 16645)
-- Name: employees; Type: TABLE; Schema: public; Owner: cosmetic_employee
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    code character varying(255) NOT NULL,
    department_id character varying(255) NOT NULL,
    hired_at timestamp with time zone NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    phone character varying(255),
    address character varying(255),
    "position" text NOT NULL,
    CONSTRAINT employees_position_check CHECK (("position" = ANY (ARRAY['staff'::text, 'manager'::text]))),
    CONSTRAINT employees_status_check CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'ON_LEAVE'::text, 'TERMINATED'::text])))
);


ALTER TABLE public.employees OWNER TO cosmetic_employee;

--
-- TOC entry 216 (class 1259 OID 16638)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_employee
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_employee;

--
-- TOC entry 215 (class 1259 OID 16637)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_employee
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_employee;

--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_employee
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 3307 (class 2604 OID 16641)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_employee
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3466 (class 0 OID 16645)
-- Dependencies: 217
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: cosmetic_employee
--

COPY public.employees (id, user_id, created_at, updated_at, code, department_id, hired_at, status, phone, address, "position") FROM stdin;
6a80152b-ee2f-47e4-9bda-19db665d6db8	a4543a25-f93c-448d-a0a9-30ebb042445f	2026-09-06 06:25:13.828+00	2026-09-06 06:25:13.828+00	NV_00001	ba794014-91d9-459b-aa0f-83d330313947	2023-05-30 00:00:00+00	ACTIVE	\N	\N	staff
8a71217d-b297-4c73-bf04-aa5340d5955d	f7427d13-270e-4cd5-876e-f6d24d232994	2026-09-06 09:38:28.738+00	2026-09-06 09:38:28.738+00	NV_00002	95dcaa9a-52b4-4aac-8d93-4a3a1a62c1f6	2023-05-30 00:00:00+00	ACTIVE	\N	\N	staff
1a80fe7b-2d50-4d24-b58d-6f7957201a29	c748da0d-6ba4-4733-bcdc-a95e694142ab	2026-09-06 09:40:04.198+00	2026-09-06 09:40:04.198+00	NV_00003	95dcaa9a-52b4-4aac-8d93-4a3a1a62c1f6	2023-05-30 00:00:00+00	ACTIVE	\N	\N	manager
efc4a610-df79-4e73-b52d-d3f720498d61	bc929dea-180d-4ed1-8b6e-fa1a4f2c2448	2026-09-06 11:08:20.164+00	2026-09-06 11:08:20.164+00	NV_00004	d37b1cc6-48e6-445a-b3b4-518d72fd3bc7	2023-05-30 00:00:00+00	ACTIVE	\N	\N	manager
898934fa-893e-4fb2-8292-20c17f98914c	d4246712-f7cb-49e9-bafc-9dfb7075f0e1	2026-09-06 11:10:09.123+00	2026-09-06 11:10:09.123+00	NV_00005	d37b1cc6-48e6-445a-b3b4-518d72fd3bc7	2023-05-30 00:00:00+00	ACTIVE	\N	\N	staff
\.


--
-- TOC entry 3465 (class 0 OID 16638)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_employee
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260825095909	2026-09-05 12:20:22.3279+00
2	Migration20260825171114	2026-09-05 12:20:22.3279+00
3	Migration20260825174219	2026-09-05 12:20:22.3279+00
4	Migration20260825174317	2026-09-05 12:20:22.3279+00
\.


--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_employee
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 4, true);


--
-- TOC entry 3316 (class 2606 OID 16656)
-- Name: employees employees_code_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_employee
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_code_unique UNIQUE (code);


--
-- TOC entry 3318 (class 2606 OID 16650)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_employee
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 3320 (class 2606 OID 16652)
-- Name: employees employees_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_employee
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_unique UNIQUE (user_id);


--
-- TOC entry 3314 (class 2606 OID 16644)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_employee
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_employee;


--
-- TOC entry 2043 (class 826 OID 16421)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_employee;


--
-- TOC entry 2042 (class 826 OID 16420)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_employee;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict S0aTRBPKAwua1oEkIWuGfJUi4tJmkL9MZDrfA1kyGfGQhBzDEL8iRTsvlzGzwjV

--
-- Database "cosmetic_inventory_service" dump
--

--
-- PostgreSQL database dump
--

\restrict bkH3shkSRFuW3uOzNDVbp4jWLZSnQXh71qZr7NFsbDWz0c3BbtfuMufamf2Q8nr

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3480 (class 1262 OID 16407)
-- Name: cosmetic_inventory_service; Type: DATABASE; Schema: -; Owner: cosmetic_inventory
--

CREATE DATABASE cosmetic_inventory_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_inventory_service OWNER TO cosmetic_inventory;

\unrestrict bkH3shkSRFuW3uOzNDVbp4jWLZSnQXh71qZr7NFsbDWz0c3BbtfuMufamf2Q8nr
\connect cosmetic_inventory_service
\restrict bkH3shkSRFuW3uOzNDVbp4jWLZSnQXh71qZr7NFsbDWz0c3BbtfuMufamf2Q8nr

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
-- TOC entry 217 (class 1259 OID 16668)
-- Name: inventories; Type: TABLE; Schema: public; Owner: cosmetic_inventory
--

CREATE TABLE public.inventories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    variant_id character varying(255) NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    last_updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    expiry_date date,
    CONSTRAINT inventories_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE public.inventories OWNER TO cosmetic_inventory;

--
-- TOC entry 216 (class 1259 OID 16661)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_inventory
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_inventory;

--
-- TOC entry 215 (class 1259 OID 16660)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_inventory
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_inventory;

--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_inventory
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 218 (class 1259 OID 16678)
-- Name: stock_adjustments; Type: TABLE; Schema: public; Owner: cosmetic_inventory
--

CREATE TABLE public.stock_adjustments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    inventory_id uuid NOT NULL,
    variant_id character varying(255) NOT NULL,
    adjustment integer NOT NULL,
    reason character varying(255) NOT NULL,
    note character varying(255),
    created_by character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT stock_adjustments_adjustment_check CHECK ((adjustment <> 0)),
    CONSTRAINT stock_adjustments_reason_check CHECK (((reason)::text = ANY ((ARRAY['DAMAGED'::character varying, 'DEFECTIVE'::character varying, 'EXPIRED'::character varying, 'OVERSTOCK'::character varying, 'OTHER'::character varying])::text[])))
);


ALTER TABLE public.stock_adjustments OWNER TO cosmetic_inventory;

--
-- TOC entry 3311 (class 2604 OID 16664)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_inventory
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3473 (class 0 OID 16668)
-- Dependencies: 217
-- Data for Name: inventories; Type: TABLE DATA; Schema: public; Owner: cosmetic_inventory
--

COPY public.inventories (id, variant_id, quantity, last_updated_at, created_at, updated_at, expiry_date) FROM stdin;
\.


--
-- TOC entry 3472 (class 0 OID 16661)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_inventory
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260904173013	2026-09-05 12:20:23.770935+00
2	Migration20260905120000	2026-09-05 12:20:23.770935+00
\.


--
-- TOC entry 3474 (class 0 OID 16678)
-- Dependencies: 218
-- Data for Name: stock_adjustments; Type: TABLE DATA; Schema: public; Owner: cosmetic_inventory
--

COPY public.stock_adjustments (id, inventory_id, variant_id, adjustment, reason, note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_inventory
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);


--
-- TOC entry 3322 (class 2606 OID 16674)
-- Name: inventories inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_inventory
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT inventories_pkey PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 16676)
-- Name: inventories inventories_variant_id_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_inventory
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT inventories_variant_id_unique UNIQUE (variant_id);


--
-- TOC entry 3320 (class 2606 OID 16667)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_inventory
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 16685)
-- Name: stock_adjustments stock_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_inventory
--

ALTER TABLE ONLY public.stock_adjustments
    ADD CONSTRAINT stock_adjustments_pkey PRIMARY KEY (id);


--
-- TOC entry 3327 (class 2606 OID 16686)
-- Name: stock_adjustments stock_adjustments_inventory_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_inventory
--

ALTER TABLE ONLY public.stock_adjustments
    ADD CONSTRAINT stock_adjustments_inventory_id_foreign FOREIGN KEY (inventory_id) REFERENCES public.inventories(id) ON DELETE CASCADE;


--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_inventory;


--
-- TOC entry 2047 (class 826 OID 16431)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_inventory;


--
-- TOC entry 2046 (class 826 OID 16430)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_inventory;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict bkH3shkSRFuW3uOzNDVbp4jWLZSnQXh71qZr7NFsbDWz0c3BbtfuMufamf2Q8nr

--
-- Database "cosmetic_invoice_service" dump
--

--
-- PostgreSQL database dump
--

\restrict W0xneT0V9j9U2vV0hovImFAbQdSauLwfAmBVLOzkN34mGHWCPN76ooSR6zPYc3t

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3475 (class 1262 OID 16410)
-- Name: cosmetic_invoice_service; Type: DATABASE; Schema: -; Owner: cosmetic_invoice
--

CREATE DATABASE cosmetic_invoice_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_invoice_service OWNER TO cosmetic_invoice;

\unrestrict W0xneT0V9j9U2vV0hovImFAbQdSauLwfAmBVLOzkN34mGHWCPN76ooSR6zPYc3t
\connect cosmetic_invoice_service
\restrict W0xneT0V9j9U2vV0hovImFAbQdSauLwfAmBVLOzkN34mGHWCPN76ooSR6zPYc3t

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
-- TOC entry 217 (class 1259 OID 16701)
-- Name: invoices; Type: TABLE; Schema: public; Owner: cosmetic_invoice
--

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(255) NOT NULL,
    order_id character varying(255) NOT NULL,
    customer_id character varying(255) NOT NULL,
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    paid_amount numeric(12,2) DEFAULT 0 NOT NULL,
    status text DEFAULT 'UNPAID'::text NOT NULL,
    note character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT invoices_paid_amount_check CHECK ((paid_amount >= (0)::numeric)),
    CONSTRAINT invoices_status_check CHECK ((status = ANY (ARRAY['UNPAID'::text, 'PARTIAL'::text, 'PAID'::text]))),
    CONSTRAINT invoices_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


ALTER TABLE public.invoices OWNER TO cosmetic_invoice;

--
-- TOC entry 216 (class 1259 OID 16694)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_invoice
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_invoice;

--
-- TOC entry 215 (class 1259 OID 16693)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_invoice
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_invoice;

--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_invoice
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 3307 (class 2604 OID 16697)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_invoice
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3469 (class 0 OID 16701)
-- Dependencies: 217
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: cosmetic_invoice
--

COPY public.invoices (id, code, order_id, customer_id, total_amount, paid_amount, status, note, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3468 (class 0 OID 16694)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_invoice
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260904182209	2026-09-05 12:20:24.976494+00
\.


--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_invoice
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3319 (class 2606 OID 16713)
-- Name: invoices invoices_code_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_invoice
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_code_unique UNIQUE (code);


--
-- TOC entry 3321 (class 2606 OID 16715)
-- Name: invoices invoices_order_id_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_invoice
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_unique UNIQUE (order_id);


--
-- TOC entry 3323 (class 2606 OID 16711)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_invoice
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 3317 (class 2606 OID 16700)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_invoice
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_invoice;


--
-- TOC entry 2043 (class 826 OID 16437)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_invoice;


--
-- TOC entry 2042 (class 826 OID 16436)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_invoice;


-- Completed on 2026-09-06 12:20:17 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict W0xneT0V9j9U2vV0hovImFAbQdSauLwfAmBVLOzkN34mGHWCPN76ooSR6zPYc3t

--
-- Database "cosmetic_order_service" dump
--

--
-- PostgreSQL database dump
--

\restrict f7R6nTHMLWS4HyPM9A8HfbIl0H5hxNvTcQ8gI8uqNImrwFdTMEvKs9sOZalLSYa

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:17 UTC

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
-- TOC entry 3496 (class 1262 OID 16409)
-- Name: cosmetic_order_service; Type: DATABASE; Schema: -; Owner: cosmetic_order
--

CREATE DATABASE cosmetic_order_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_order_service OWNER TO cosmetic_order;

\unrestrict f7R6nTHMLWS4HyPM9A8HfbIl0H5hxNvTcQ8gI8uqNImrwFdTMEvKs9sOZalLSYa
\connect cosmetic_order_service
\restrict f7R6nTHMLWS4HyPM9A8HfbIl0H5hxNvTcQ8gI8uqNImrwFdTMEvKs9sOZalLSYa

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
-- TOC entry 216 (class 1259 OID 16720)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_order
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_order;

--
-- TOC entry 215 (class 1259 OID 16719)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_order
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_order;

--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_order
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 218 (class 1259 OID 16739)
-- Name: order_lines; Type: TABLE; Schema: public; Owner: cosmetic_order
--

CREATE TABLE public.order_lines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    variant_id character varying(255) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT order_lines_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_lines_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.order_lines OWNER TO cosmetic_order;

--
-- TOC entry 219 (class 1259 OID 16746)
-- Name: order_transactions; Type: TABLE; Schema: public; Owner: cosmetic_order
--

CREATE TABLE public.order_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    variant_id character varying(255) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    employee_id character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT order_transactions_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_transactions_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT order_transactions_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.order_transactions OWNER TO cosmetic_order;

--
-- TOC entry 217 (class 1259 OID 16727)
-- Name: orders; Type: TABLE; Schema: public; Owner: cosmetic_order
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(255) NOT NULL,
    customer_id character varying(255) NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['PENDING'::text, 'COMPLETED'::text, 'CANCELLED'::text])))
);


ALTER TABLE public.orders OWNER TO cosmetic_order;

--
-- TOC entry 3315 (class 2604 OID 16723)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_order
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3487 (class 0 OID 16720)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_order
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260904182207	2026-09-05 12:20:26.548196+00
\.


--
-- TOC entry 3489 (class 0 OID 16739)
-- Dependencies: 218
-- Data for Name: order_lines; Type: TABLE DATA; Schema: public; Owner: cosmetic_order
--

COPY public.order_lines (id, order_id, variant_id, quantity, unit_price, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3490 (class 0 OID 16746)
-- Dependencies: 219
-- Data for Name: order_transactions; Type: TABLE DATA; Schema: public; Owner: cosmetic_order
--

COPY public.order_transactions (id, order_id, variant_id, quantity, unit_price, subtotal, employee_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3488 (class 0 OID 16727)
-- Dependencies: 217
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: cosmetic_order
--

COPY public.orders (id, code, customer_id, status, total_amount, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_order
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3332 (class 2606 OID 16726)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_order
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 16745)
-- Name: order_lines order_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_order
--

ALTER TABLE ONLY public.order_lines
    ADD CONSTRAINT order_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 16755)
-- Name: order_transactions order_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_order
--

ALTER TABLE ONLY public.order_transactions
    ADD CONSTRAINT order_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3334 (class 2606 OID 16738)
-- Name: orders orders_code_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_order
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_code_unique UNIQUE (code);


--
-- TOC entry 3336 (class 2606 OID 16736)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_order
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3341 (class 2606 OID 16762)
-- Name: order_lines order_lines_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_order
--

ALTER TABLE ONLY public.order_lines
    ADD CONSTRAINT order_lines_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 3342 (class 2606 OID 16767)
-- Name: order_transactions order_transactions_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_order
--

ALTER TABLE ONLY public.order_transactions
    ADD CONSTRAINT order_transactions_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_order;


--
-- TOC entry 2051 (class 826 OID 16435)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_order;


--
-- TOC entry 2050 (class 826 OID 16434)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_order;


-- Completed on 2026-09-06 12:20:18 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict f7R6nTHMLWS4HyPM9A8HfbIl0H5hxNvTcQ8gI8uqNImrwFdTMEvKs9sOZalLSYa

--
-- Database "cosmetic_purchase_service" dump
--

--
-- PostgreSQL database dump
--

\restrict OtMWf3eoVcBSHDViV3x1UQEYarumlqpFhTQkdQ3nNBSd0aoS0TmGiVQRhXoQpF3

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:18 UTC

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
-- TOC entry 3496 (class 1262 OID 16408)
-- Name: cosmetic_purchase_service; Type: DATABASE; Schema: -; Owner: cosmetic_purchase
--

CREATE DATABASE cosmetic_purchase_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_purchase_service OWNER TO cosmetic_purchase;

\unrestrict OtMWf3eoVcBSHDViV3x1UQEYarumlqpFhTQkdQ3nNBSd0aoS0TmGiVQRhXoQpF3
\connect cosmetic_purchase_service
\restrict OtMWf3eoVcBSHDViV3x1UQEYarumlqpFhTQkdQ3nNBSd0aoS0TmGiVQRhXoQpF3

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
-- TOC entry 216 (class 1259 OID 16773)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_purchase
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_purchase;

--
-- TOC entry 215 (class 1259 OID 16772)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_purchase
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_purchase;

--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_purchase
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 218 (class 1259 OID 16792)
-- Name: purchase_order_lines; Type: TABLE; Schema: public; Owner: cosmetic_purchase
--

CREATE TABLE public.purchase_order_lines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    purchase_order_id uuid NOT NULL,
    variant_id character varying(255) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT purchase_order_lines_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT purchase_order_lines_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.purchase_order_lines OWNER TO cosmetic_purchase;

--
-- TOC entry 217 (class 1259 OID 16780)
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: cosmetic_purchase
--

CREATE TABLE public.purchase_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(255) NOT NULL,
    supplier_id character varying(255) NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT purchase_orders_status_check CHECK ((status = ANY (ARRAY['PENDING'::text, 'COMPLETED'::text, 'CANCELLED'::text])))
);


ALTER TABLE public.purchase_orders OWNER TO cosmetic_purchase;

--
-- TOC entry 219 (class 1259 OID 16807)
-- Name: purchase_transactions; Type: TABLE; Schema: public; Owner: cosmetic_purchase
--

CREATE TABLE public.purchase_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    purchase_order_id uuid NOT NULL,
    variant_id character varying(255) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    employee_id character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT purchase_transactions_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT purchase_transactions_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT purchase_transactions_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.purchase_transactions OWNER TO cosmetic_purchase;

--
-- TOC entry 3315 (class 2604 OID 16776)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_purchase
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3487 (class 0 OID 16773)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_purchase
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260904175012	2026-09-05 12:20:28.101388+00
2	Migration20260904180507	2026-09-05 12:20:28.101388+00
\.


--
-- TOC entry 3489 (class 0 OID 16792)
-- Dependencies: 218
-- Data for Name: purchase_order_lines; Type: TABLE DATA; Schema: public; Owner: cosmetic_purchase
--

COPY public.purchase_order_lines (id, purchase_order_id, variant_id, quantity, unit_price, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3488 (class 0 OID 16780)
-- Dependencies: 217
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: cosmetic_purchase
--

COPY public.purchase_orders (id, code, supplier_id, status, total_amount, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3490 (class 0 OID 16807)
-- Dependencies: 219
-- Data for Name: purchase_transactions; Type: TABLE DATA; Schema: public; Owner: cosmetic_purchase
--

COPY public.purchase_transactions (id, purchase_order_id, variant_id, quantity, unit_price, subtotal, employee_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_purchase
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);


--
-- TOC entry 3332 (class 2606 OID 16779)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_purchase
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 16798)
-- Name: purchase_order_lines purchase_order_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_purchase
--

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 3334 (class 2606 OID 16791)
-- Name: purchase_orders purchase_orders_code_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_purchase
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_code_unique UNIQUE (code);


--
-- TOC entry 3336 (class 2606 OID 16789)
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_purchase
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 16816)
-- Name: purchase_transactions purchase_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_purchase
--

ALTER TABLE ONLY public.purchase_transactions
    ADD CONSTRAINT purchase_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3341 (class 2606 OID 16800)
-- Name: purchase_order_lines purchase_order_lines_purchase_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_purchase
--

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_purchase_order_id_foreign FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


--
-- TOC entry 3342 (class 2606 OID 16817)
-- Name: purchase_transactions purchase_transactions_purchase_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: cosmetic_purchase
--

ALTER TABLE ONLY public.purchase_transactions
    ADD CONSTRAINT purchase_transactions_purchase_order_id_foreign FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_purchase;


--
-- TOC entry 2051 (class 826 OID 16433)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_purchase;


--
-- TOC entry 2050 (class 826 OID 16432)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_purchase;


-- Completed on 2026-09-06 12:20:18 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict OtMWf3eoVcBSHDViV3x1UQEYarumlqpFhTQkdQ3nNBSd0aoS0TmGiVQRhXoQpF3

--
-- Database "cosmetic_supplier_service" dump
--

--
-- PostgreSQL database dump
--

\restrict J7y6zRhVtZzDaG1DtWcm2v2Gu12QKvfd9dp5gBpyh7LGxFneoKyJZ5eoQdxdmlT

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:18 UTC

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
-- TOC entry 3470 (class 1262 OID 16405)
-- Name: cosmetic_supplier_service; Type: DATABASE; Schema: -; Owner: cosmetic_supplier
--

CREATE DATABASE cosmetic_supplier_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_supplier_service OWNER TO cosmetic_supplier;

\unrestrict J7y6zRhVtZzDaG1DtWcm2v2Gu12QKvfd9dp5gBpyh7LGxFneoKyJZ5eoQdxdmlT
\connect cosmetic_supplier_service
\restrict J7y6zRhVtZzDaG1DtWcm2v2Gu12QKvfd9dp5gBpyh7LGxFneoKyJZ5eoQdxdmlT

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
-- TOC entry 216 (class 1259 OID 16826)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_supplier
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_supplier;

--
-- TOC entry 215 (class 1259 OID 16825)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_supplier
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_supplier;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_supplier
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 217 (class 1259 OID 16833)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: cosmetic_supplier
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    address character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.suppliers OWNER TO cosmetic_supplier;

--
-- TOC entry 3307 (class 2604 OID 16829)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_supplier
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3463 (class 0 OID 16826)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_supplier
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260904165135	2026-09-05 12:20:29.770329+00
\.


--
-- TOC entry 3464 (class 0 OID 16833)
-- Dependencies: 217
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: cosmetic_supplier
--

COPY public.suppliers (id, code, name, email, phone, address, is_active, created_at, updated_at) FROM stdin;
5868afb6-c45c-47be-8d08-d6c702ed6768	NCC_00002	SUP2	sup2@email.com	0999953493	Hà Nội	t	2026-09-06 09:40:29.622+00	2026-09-06 09:40:29.622+00
f3b71d23-ac43-4095-b3bb-afdd00d06fe3	NCC_00003	SUP1	sup1@email.com	0999953492	Hà Nội	t	2026-09-06 10:34:47.426+00	2026-09-06 10:34:47.426+00
\.


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_supplier
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- TOC entry 3312 (class 2606 OID 16832)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_supplier
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3314 (class 2606 OID 16843)
-- Name: suppliers suppliers_code_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_supplier
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_code_unique UNIQUE (code);


--
-- TOC entry 3316 (class 2606 OID 16845)
-- Name: suppliers suppliers_email_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_supplier
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_email_unique UNIQUE (email);


--
-- TOC entry 3318 (class 2606 OID 16841)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_supplier
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_supplier;


--
-- TOC entry 2043 (class 826 OID 16427)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_supplier;


--
-- TOC entry 2042 (class 826 OID 16426)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_supplier;


-- Completed on 2026-09-06 12:20:18 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict J7y6zRhVtZzDaG1DtWcm2v2Gu12QKvfd9dp5gBpyh7LGxFneoKyJZ5eoQdxdmlT

--
-- Database "cosmetic_user_service" dump
--

--
-- PostgreSQL database dump
--

\restrict 7e53lkAwuluqCbWGicwcfUW5a7M5hVbB5FElAVZfIucDwlyuJSXWfOe03KkOfCm

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:18 UTC

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
-- TOC entry 3469 (class 1262 OID 16384)
-- Name: cosmetic_user_service; Type: DATABASE; Schema: -; Owner: cosmetic_admin
--

CREATE DATABASE cosmetic_user_service WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE cosmetic_user_service OWNER TO cosmetic_admin;

\unrestrict 7e53lkAwuluqCbWGicwcfUW5a7M5hVbB5FElAVZfIucDwlyuJSXWfOe03KkOfCm
\connect cosmetic_user_service
\restrict 7e53lkAwuluqCbWGicwcfUW5a7M5hVbB5FElAVZfIucDwlyuJSXWfOe03KkOfCm

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
-- TOC entry 216 (class 1259 OID 16847)
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: cosmetic_user
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
);


ALTER TABLE public.mikro_orm_migrations OWNER TO cosmetic_user;

--
-- TOC entry 215 (class 1259 OID 16846)
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cosmetic_user
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO cosmetic_user;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cosmetic_user
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- TOC entry 217 (class 1259 OID 16854)
-- Name: users; Type: TABLE; Schema: public; Owner: cosmetic_user
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    gender text NOT NULL,
    email character varying(255) NOT NULL,
    role_id character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    CONSTRAINT users_gender_check CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text])))
);


ALTER TABLE public.users OWNER TO cosmetic_user;

--
-- TOC entry 3307 (class 2604 OID 16850)
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: cosmetic_user
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- TOC entry 3462 (class 0 OID 16847)
-- Dependencies: 216
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_user
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20260823091036	2026-09-05 12:20:31.038379+00
2	Migration20260823091940	2026-09-05 12:20:31.038379+00
3	Migration20260825000000	2026-09-05 12:20:31.038379+00
4	Migration20260830070949	2026-09-05 12:20:31.038379+00
\.


--
-- TOC entry 3463 (class 0 OID 16854)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: cosmetic_user
--

COPY public.users (id, first_name, last_name, gender, email, role_id, created_at, updated_at, is_active) FROM stdin;
a4543a25-f93c-448d-a0a9-30ebb042445f	Phạm Đình	Thái	male	phamdinhthai2005@gmail.com	admin	2026-09-06 06:25:13.556+00	2026-09-06 06:25:13.556+00	t
693256c5-c87d-4d49-99e6-ac4ca0a4a86a	Ngô Khuê	Văn	male	khuevan123@gmail.com	customer	2026-09-06 06:53:43.998+00	2026-09-06 06:53:43.998+00	t
62851176-a6bc-483b-9552-364872daec6a	Ngô	Anh Tây Sơn	male	johnneoson1211@gmail.com	customer	2026-09-06 07:04:34.71+00	2026-09-06 07:04:34.71+00	t
f7427d13-270e-4cd5-876e-f6d24d232994	Dương Mai	Anh	female	maianh123@gmail.com	employee	2026-09-06 09:38:28.634+00	2026-09-06 09:38:28.634+00	t
c748da0d-6ba4-4733-bcdc-a95e694142ab	Nguyễn Danh	Vũ	male	danhvu123@gmail.com	employee	2026-09-06 09:40:04.111+00	2026-09-06 09:40:04.111+00	t
bc929dea-180d-4ed1-8b6e-fa1a4f2c2448	Nguyễn Văn	A	male	nguyenvana@gmail.com	employee	2026-09-06 11:08:20.028+00	2026-09-06 11:08:20.028+00	t
d4246712-f7cb-49e9-bafc-9dfb7075f0e1	Nguyễn Văn	B	male	nguyenvanb123@gmail.com	employee	2026-09-06 11:10:09.014+00	2026-09-06 11:10:09.014+00	t
\.


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 215
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_user
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 4, true);


--
-- TOC entry 3313 (class 2606 OID 16853)
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_user
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3315 (class 2606 OID 16863)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: cosmetic_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 3317 (class 2606 OID 16861)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: cosmetic_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 3469
-- Name: DATABASE cosmetic_user_service; Type: ACL; Schema: -; Owner: cosmetic_admin
--

GRANT ALL ON DATABASE cosmetic_user_service TO cosmetic_user;


--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO cosmetic_user;


--
-- TOC entry 2043 (class 826 OID 16413)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_user;


--
-- TOC entry 2042 (class 826 OID 16412)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cosmetic_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cosmetic_admin IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_user;


-- Completed on 2026-09-06 12:20:18 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict 7e53lkAwuluqCbWGicwcfUW5a7M5hVbB5FElAVZfIucDwlyuJSXWfOe03KkOfCm

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict LbeC8UBfEKffg3dMTDbuHuKZIrTUcZbnrshZWN5G1JDF4vcnpQVhIfmhEbrW9fL

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-09-06 12:20:18 UTC

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

-- Completed on 2026-09-06 12:20:18 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict LbeC8UBfEKffg3dMTDbuHuKZIrTUcZbnrshZWN5G1JDF4vcnpQVhIfmhEbrW9fL

-- Completed on 2026-09-06 12:20:18 UTC

--
-- PostgreSQL database cluster dump complete
--



-- ===== cosmetic_authentication_service ===== --
--
-- PostgreSQL database dump
--

\restrict RbKFHgfKQ7832vBl4cxyx0KzLNyzxvPiEKffbYNtWmmvtORp95IxQ03F2MbMXDb

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: auth_users; Type: TABLE DATA; Schema: public; Owner: cosmetic_auth
--

INSERT INTO public.auth_users (id, user_id, password, email_verified_at, created_at, updated_at) VALUES ('d314129e-9704-489a-9c5b-56502d10f176', 'a4543a25-f93c-448d-a0a9-30ebb042445f', '$2b$10$2wk5lJkhY75gqHrbG3ya1eXKv80Xsj9Cra9HoU3An0.W2VJ9Mp.1G', NULL, '2026-09-06 06:25:13.778+00', '2026-09-06 06:25:13.778+00') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_users (id, user_id, password, email_verified_at, created_at, updated_at) VALUES ('e40cb635-4cf4-4080-888e-7d402cdc7698', '693256c5-c87d-4d49-99e6-ac4ca0a4a86a', '$2b$10$ZQIP1HsW8OAA0gxDrPgo2uCleL109J16Nh7EXXcczIIo6RPWGm80W', NULL, '2026-09-06 06:53:44.091+00', '2026-09-06 06:53:44.091+00') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_users (id, user_id, password, email_verified_at, created_at, updated_at) VALUES ('71dd3a44-2948-440b-93c9-b994a851c1ef', '62851176-a6bc-483b-9552-364872daec6a', '$2b$10$B1tJLRSQEOcYYdyK/QWn6e1NO35.WqU.mtpN.pFDPOSjfWZMaO1gK', NULL, '2026-09-06 07:04:34.814+00', '2026-09-06 07:04:34.814+00') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_users (id, user_id, password, email_verified_at, created_at, updated_at) VALUES ('b7de74c7-acf1-488c-bdca-3b0dd4fda70a', 'f7427d13-270e-4cd5-876e-f6d24d232994', '$2b$10$kf4ax9NDh57vE0amV0Sk7Oi0QWIvGAYvCC/7wDtYM.Ig6qWxaxPZy', NULL, '2026-09-06 09:38:28.708+00', '2026-09-06 09:38:28.708+00') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_users (id, user_id, password, email_verified_at, created_at, updated_at) VALUES ('62d7406f-f4d4-407e-a413-6c78986c522d', 'c748da0d-6ba4-4733-bcdc-a95e694142ab', '$2b$10$KsoJaFwJcg3LSCUDhlabLOPvqviC7WCXzkZaYRuQAoKtIt4FeM80e', NULL, '2026-09-06 09:40:04.182+00', '2026-09-06 09:40:04.182+00') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_users (id, user_id, password, email_verified_at, created_at, updated_at) VALUES ('928693d5-7581-421b-aef3-7fd1d923500a', 'bc929dea-180d-4ed1-8b6e-fa1a4f2c2448', '$2b$10$//W/qP5BX5e9gzDvpJL3veDT1PLHABoNRvvzno3IXS1XmOaJXt0.6', NULL, '2026-09-06 11:08:20.135+00', '2026-09-06 11:08:20.135+00') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_users (id, user_id, password, email_verified_at, created_at, updated_at) VALUES ('83867738-707e-499c-838d-bb3e7e74f514', 'd4246712-f7cb-49e9-bafc-9dfb7075f0e1', '$2b$10$OtZTOyoK8sn7a4Rhn4gzf.rohH3M7nohQEeIAbVjYDYkRMbKEuyRG', NULL, '2026-09-06 11:10:09.103+00', '2026-09-06 11:10:09.103+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_auth
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260819093223_create_auth_users_table', '2026-09-05 12:20:13.966065+00') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_auth
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict RbKFHgfKQ7832vBl4cxyx0KzLNyzxvPiEKffbYNtWmmvtORp95IxQ03F2MbMXDb


-- ===== cosmetic_authorization_service ===== --
--
-- PostgreSQL database dump
--

\restrict 7oBMS24zHOTheZuY5arGvi2x7d8hfalGcb38eHWgwgP6HNf99Rxc3CiYWK42am4

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_authorization
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260822085719_create_roles_table', '2026-09-05 12:20:15.161224+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: cosmetic_authorization
--

INSERT INTO public.roles (id, name) VALUES ('admin', 'Admin') ON CONFLICT DO NOTHING;
INSERT INTO public.roles (id, name) VALUES ('employee', 'Employee') ON CONFLICT DO NOTHING;
INSERT INTO public.roles (id, name) VALUES ('customer', 'Customer') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_authorization
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 7oBMS24zHOTheZuY5arGvi2x7d8hfalGcb38eHWgwgP6HNf99Rxc3CiYWK42am4


-- ===== cosmetic_department_service ===== --
--
-- PostgreSQL database dump
--

\restrict gCelW2J253loUlcKkf9mtDdK5mCoKNdzbeRuycIj2apr01VAAQjVs4dSXXTwABz

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: cosmetic_department
--

INSERT INTO public.departments (id, name, manager_id, created_at, updated_at, code, is_active) VALUES ('ba794014-91d9-459b-aa0f-83d330313947', 'Công nghệ thông tin', NULL, '2026-09-06 06:20:01.257+00', '2026-09-06 06:20:01.257+00', 'IT', true) ON CONFLICT DO NOTHING;
INSERT INTO public.departments (id, name, manager_id, created_at, updated_at, code, is_active) VALUES ('95dcaa9a-52b4-4aac-8d93-4a3a1a62c1f6', 'Kho', NULL, '2026-09-06 09:22:17.75+00', '2026-09-06 09:22:17.75+00', 'warehouse', true) ON CONFLICT DO NOTHING;
INSERT INTO public.departments (id, name, manager_id, created_at, updated_at, code, is_active) VALUES ('d37b1cc6-48e6-445a-b3b4-518d72fd3bc7', 'Kinh Doanh', NULL, '2026-09-06 11:07:01.736+00', '2026-09-06 11:07:01.736+00', 'sales', true) ON CONFLICT DO NOTHING;


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_department
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260824150322', '2026-09-05 12:20:21.207467+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (2, 'Migration20260824162437', '2026-09-05 12:20:21.207467+00') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_department
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict gCelW2J253loUlcKkf9mtDdK5mCoKNdzbeRuycIj2apr01VAAQjVs4dSXXTwABz


-- ===== cosmetic_employee_service ===== --
--
-- PostgreSQL database dump
--

\restrict Jav8P8WgmSeTWcWaIvzBbTy1dcO1tcl44IbCJYYoR0xcfuK6Outa3iXW5mPEPVr

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: cosmetic_employee
--

INSERT INTO public.employees (id, user_id, created_at, updated_at, code, department_id, hired_at, status, phone, address, "position") VALUES ('6a80152b-ee2f-47e4-9bda-19db665d6db8', 'a4543a25-f93c-448d-a0a9-30ebb042445f', '2026-09-06 06:25:13.828+00', '2026-09-06 06:25:13.828+00', 'NV_00001', 'ba794014-91d9-459b-aa0f-83d330313947', '2023-05-30 00:00:00+00', 'ACTIVE', NULL, NULL, 'staff') ON CONFLICT DO NOTHING;
INSERT INTO public.employees (id, user_id, created_at, updated_at, code, department_id, hired_at, status, phone, address, "position") VALUES ('8a71217d-b297-4c73-bf04-aa5340d5955d', 'f7427d13-270e-4cd5-876e-f6d24d232994', '2026-09-06 09:38:28.738+00', '2026-09-06 09:38:28.738+00', 'NV_00002', '95dcaa9a-52b4-4aac-8d93-4a3a1a62c1f6', '2023-05-30 00:00:00+00', 'ACTIVE', NULL, NULL, 'staff') ON CONFLICT DO NOTHING;
INSERT INTO public.employees (id, user_id, created_at, updated_at, code, department_id, hired_at, status, phone, address, "position") VALUES ('1a80fe7b-2d50-4d24-b58d-6f7957201a29', 'c748da0d-6ba4-4733-bcdc-a95e694142ab', '2026-09-06 09:40:04.198+00', '2026-09-06 09:40:04.198+00', 'NV_00003', '95dcaa9a-52b4-4aac-8d93-4a3a1a62c1f6', '2023-05-30 00:00:00+00', 'ACTIVE', NULL, NULL, 'manager') ON CONFLICT DO NOTHING;
INSERT INTO public.employees (id, user_id, created_at, updated_at, code, department_id, hired_at, status, phone, address, "position") VALUES ('efc4a610-df79-4e73-b52d-d3f720498d61', 'bc929dea-180d-4ed1-8b6e-fa1a4f2c2448', '2026-09-06 11:08:20.164+00', '2026-09-06 11:08:20.164+00', 'NV_00004', 'd37b1cc6-48e6-445a-b3b4-518d72fd3bc7', '2023-05-30 00:00:00+00', 'ACTIVE', NULL, NULL, 'manager') ON CONFLICT DO NOTHING;
INSERT INTO public.employees (id, user_id, created_at, updated_at, code, department_id, hired_at, status, phone, address, "position") VALUES ('898934fa-893e-4fb2-8292-20c17f98914c', 'd4246712-f7cb-49e9-bafc-9dfb7075f0e1', '2026-09-06 11:10:09.123+00', '2026-09-06 11:10:09.123+00', 'NV_00005', 'd37b1cc6-48e6-445a-b3b4-518d72fd3bc7', '2023-05-30 00:00:00+00', 'ACTIVE', NULL, NULL, 'staff') ON CONFLICT DO NOTHING;


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_employee
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260825095909', '2026-09-05 12:20:22.3279+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (2, 'Migration20260825171114', '2026-09-05 12:20:22.3279+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (3, 'Migration20260825174219', '2026-09-05 12:20:22.3279+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (4, 'Migration20260825174317', '2026-09-05 12:20:22.3279+00') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_employee
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Jav8P8WgmSeTWcWaIvzBbTy1dcO1tcl44IbCJYYoR0xcfuK6Outa3iXW5mPEPVr


-- ===== cosmetic_customer_service ===== --
--
-- PostgreSQL database dump
--

\restrict Xh92KTh29iHZrOneRD0Qkd6iSEdUM2z1MB2Fv9AIAa7QuQamoZXpIWf8TCbNo6r

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: cosmetic_customer
--

INSERT INTO public.customers (id, user_id, code, created_at, updated_at) VALUES ('d619f5a1-1210-4196-aae4-dd86b8309edf', '693256c5-c87d-4d49-99e6-ac4ca0a4a86a', 'CUS-1691646F', '2026-09-06 06:53:44.148+00', '2026-09-06 06:53:44.148+00') ON CONFLICT DO NOTHING;
INSERT INTO public.customers (id, user_id, code, created_at, updated_at) VALUES ('7c44713b-5bf6-40f8-8695-732ff8b3f7ae', '62851176-a6bc-483b-9552-364872daec6a', 'CUS-A00E4A9F', '2026-09-06 07:04:34.832+00', '2026-09-06 07:04:34.832+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: cosmetic_customer
--



--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_customer
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260901085128', '2026-09-05 12:20:20.069993+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: phones; Type: TABLE DATA; Schema: public; Owner: cosmetic_customer
--



--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_customer
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Xh92KTh29iHZrOneRD0Qkd6iSEdUM2z1MB2Fv9AIAa7QuQamoZXpIWf8TCbNo6r


-- ===== cosmetic_category_service ===== --
--
-- PostgreSQL database dump
--

\restrict ed8BYXaVhw05T9Q00hztFVNuKzv62hSpFp5PjFaqjVeJqxneuiCdWb0bGVjVgdM

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: cosmetic_category
--

INSERT INTO public.categories (id, name, description, is_active, created_at, updated_at) VALUES ('68deec87-324e-41fd-9a46-db22248b2662', 'cate123', '21paosdjaspdodsa', true, '2026-09-06 11:08:54.15+00', '2026-09-06 11:08:54.15+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_category
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260904164533', '2026-09-05 12:20:17.735426+00') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_category
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict ed8BYXaVhw05T9Q00hztFVNuKzv62hSpFp5PjFaqjVeJqxneuiCdWb0bGVjVgdM


-- ===== cosmetic_supplier_service ===== --
--
-- PostgreSQL database dump
--

\restrict K28IyrfQdHa0eldN9z6q0HWHpzcn5NeQHoxVzZlSUhLcKeUEfh9a7jExo4SpZoy

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_supplier
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260904165135', '2026-09-05 12:20:29.770329+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: cosmetic_supplier
--

INSERT INTO public.suppliers (id, code, name, email, phone, address, is_active, created_at, updated_at) VALUES ('5868afb6-c45c-47be-8d08-d6c702ed6768', 'NCC_00002', 'SUP2', 'sup2@email.com', '0999953493', 'Hà Nội', true, '2026-09-06 09:40:29.622+00', '2026-09-06 09:40:29.622+00') ON CONFLICT DO NOTHING;
INSERT INTO public.suppliers (id, code, name, email, phone, address, is_active, created_at, updated_at) VALUES ('f3b71d23-ac43-4095-b3bb-afdd00d06fe3', 'NCC_00003', 'SUP1', 'sup1@email.com', '0999953492', 'Hà Nội', true, '2026-09-06 10:34:47.426+00', '2026-09-06 10:34:47.426+00') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_supplier
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict K28IyrfQdHa0eldN9z6q0HWHpzcn5NeQHoxVzZlSUhLcKeUEfh9a7jExo4SpZoy


-- ===== cosmetic_cosmetic_service ===== --
--
-- PostgreSQL database dump
--

\restrict YxZ63v7thtRyYmpKGkEzVkUBKSk3sezBGZzl88nG2q2tIJtsnwXLhiWK1IRwV3I

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: cosmetics; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

INSERT INTO public.cosmetics (id, code, name, brand, origin, description, image_url, is_active, created_at, updated_at) VALUES ('b158a2c6-8dad-4990-8871-10799d44b576', 'SP_00001', 'SUP1', 'abc', 'Vietnam', 'áđâsđâsdsađasad', 'aaaaaaaaaaaaaaaaa.com', true, '2026-09-06 12:00:00.092+00', '2026-09-06 12:00:00.092+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: cosmetic_categories; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

INSERT INTO public.cosmetic_categories (id, cosmetic_id, category_id, created_at) VALUES ('77df6584-0724-4fbb-846b-63150eac704f', 'b158a2c6-8dad-4990-8871-10799d44b576', '68deec87-324e-41fd-9a46-db22248b2662', '2026-09-06 12:00:00.094+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: cosmetic_variants; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

INSERT INTO public.cosmetic_variants (id, cosmetic_id, name, color, volume, price, cost_price, is_active, created_at, updated_at) VALUES ('b18be490-c45c-4908-8e88-c143f1ba407a', 'b158a2c6-8dad-4990-8871-10799d44b576', 'a', 'red', '50', 1000000.00, 800000.00, true, '2026-09-06 12:00:00.093+00', '2026-09-06 12:00:00.093+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260904171656', '2026-09-05 12:20:18.875627+00') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_cosmetic
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict YxZ63v7thtRyYmpKGkEzVkUBKSk3sezBGZzl88nG2q2tIJtsnwXLhiWK1IRwV3I


-- ===== cosmetic_inventory_service ===== --
--
-- PostgreSQL database dump
--

\restrict l2Iah7mSXjXc52aNmio4ud2eMnHK5qo2n7xkLTYO323DkwZhzslxSUzAIq3Kq3J

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: inventories; Type: TABLE DATA; Schema: public; Owner: cosmetic_inventory
--



--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_inventory
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260904173013', '2026-09-05 12:20:23.770935+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (2, 'Migration20260905120000', '2026-09-05 12:20:23.770935+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: stock_adjustments; Type: TABLE DATA; Schema: public; Owner: cosmetic_inventory
--



--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_inventory
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict l2Iah7mSXjXc52aNmio4ud2eMnHK5qo2n7xkLTYO323DkwZhzslxSUzAIq3Kq3J


-- ===== cosmetic_purchase_service ===== --
--
-- PostgreSQL database dump
--

\restrict VxjilO5bDAyM6vGyeBddZaSWmckA5dbCpKxBfuOTsUtsIm3iAj2rjQGRMWLS6hj

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_purchase
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260904175012', '2026-09-05 12:20:28.101388+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (2, 'Migration20260904180507', '2026-09-05 12:20:28.101388+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: cosmetic_purchase
--



--
-- Data for Name: purchase_order_lines; Type: TABLE DATA; Schema: public; Owner: cosmetic_purchase
--



--
-- Data for Name: purchase_transactions; Type: TABLE DATA; Schema: public; Owner: cosmetic_purchase
--



--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_purchase
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict VxjilO5bDAyM6vGyeBddZaSWmckA5dbCpKxBfuOTsUtsIm3iAj2rjQGRMWLS6hj


-- ===== cosmetic_order_service ===== --
--
-- PostgreSQL database dump
--

\restrict J1hgSCee2fzBFBDH3sWkMruCO3pDdGIgfzTVchdzXMaUiBFzZ7b0MfFk8710CqC

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_order
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260904182207', '2026-09-05 12:20:26.548196+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: cosmetic_order
--



--
-- Data for Name: order_lines; Type: TABLE DATA; Schema: public; Owner: cosmetic_order
--



--
-- Data for Name: order_transactions; Type: TABLE DATA; Schema: public; Owner: cosmetic_order
--



--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_order
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict J1hgSCee2fzBFBDH3sWkMruCO3pDdGIgfzTVchdzXMaUiBFzZ7b0MfFk8710CqC


-- ===== cosmetic_invoice_service ===== --
--
-- PostgreSQL database dump
--

\restrict 9VhC4SKSkA8S6M8EgtBnvUY1sZSi0D3xFhKvaaEBddhyKojP3cSJ3A6H49oaGNw

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: cosmetic_invoice
--



--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_invoice
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260904182209', '2026-09-05 12:20:24.976494+00') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_invoice
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 9VhC4SKSkA8S6M8EgtBnvUY1sZSi0D3xFhKvaaEBddhyKojP3cSJ3A6H49oaGNw


-- ===== cosmetic_basket_service ===== --
--
-- PostgreSQL database dump
--

\restrict yJuO9csr4efpFZhkvh3Hse0k8LiJiWOdtkKRYuJbwHOav4fb1dfUGuhuOq3noWx

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: cosmetic_basket
--



--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: cosmetic_basket
--



--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_basket
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260905160000', '2026-09-05 12:20:16.328203+00') ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_basket
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict yJuO9csr4efpFZhkvh3Hse0k8LiJiWOdtkKRYuJbwHOav4fb1dfUGuhuOq3noWx


-- ===== cosmetic_user_service ===== --
--
-- PostgreSQL database dump
--

\restrict eVg22iH0xnwoT0kCsDUbWwEWhgL43QmuCQrjuhxcNsbEWVaPpjUbTe4a8LVB5Zd

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: cosmetic_user
--

INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (1, 'Migration20260823091036', '2026-09-05 12:20:31.038379+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (2, 'Migration20260823091940', '2026-09-05 12:20:31.038379+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (3, 'Migration20260825000000', '2026-09-05 12:20:31.038379+00') ON CONFLICT DO NOTHING;
INSERT INTO public.mikro_orm_migrations (id, name, executed_at) VALUES (4, 'Migration20260830070949', '2026-09-05 12:20:31.038379+00') ON CONFLICT DO NOTHING;


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: cosmetic_user
--

INSERT INTO public.users (id, first_name, last_name, gender, email, role_id, created_at, updated_at, is_active) VALUES ('a4543a25-f93c-448d-a0a9-30ebb042445f', 'Phạm Đình', 'Thái', 'male', 'phamdinhthai2005@gmail.com', 'admin', '2026-09-06 06:25:13.556+00', '2026-09-06 06:25:13.556+00', true) ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, first_name, last_name, gender, email, role_id, created_at, updated_at, is_active) VALUES ('693256c5-c87d-4d49-99e6-ac4ca0a4a86a', 'Ngô Khuê', 'Văn', 'male', 'khuevan123@gmail.com', 'customer', '2026-09-06 06:53:43.998+00', '2026-09-06 06:53:43.998+00', true) ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, first_name, last_name, gender, email, role_id, created_at, updated_at, is_active) VALUES ('62851176-a6bc-483b-9552-364872daec6a', 'Ngô', 'Anh Tây Sơn', 'male', 'johnneoson1211@gmail.com', 'customer', '2026-09-06 07:04:34.71+00', '2026-09-06 07:04:34.71+00', true) ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, first_name, last_name, gender, email, role_id, created_at, updated_at, is_active) VALUES ('f7427d13-270e-4cd5-876e-f6d24d232994', 'Dương Mai', 'Anh', 'female', 'maianh123@gmail.com', 'employee', '2026-09-06 09:38:28.634+00', '2026-09-06 09:38:28.634+00', true) ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, first_name, last_name, gender, email, role_id, created_at, updated_at, is_active) VALUES ('c748da0d-6ba4-4733-bcdc-a95e694142ab', 'Nguyễn Danh', 'Vũ', 'male', 'danhvu123@gmail.com', 'employee', '2026-09-06 09:40:04.111+00', '2026-09-06 09:40:04.111+00', true) ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, first_name, last_name, gender, email, role_id, created_at, updated_at, is_active) VALUES ('bc929dea-180d-4ed1-8b6e-fa1a4f2c2448', 'Nguyễn Văn', 'A', 'male', 'nguyenvana@gmail.com', 'employee', '2026-09-06 11:08:20.028+00', '2026-09-06 11:08:20.028+00', true) ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, first_name, last_name, gender, email, role_id, created_at, updated_at, is_active) VALUES ('d4246712-f7cb-49e9-bafc-9dfb7075f0e1', 'Nguyễn Văn', 'B', 'male', 'nguyenvanb123@gmail.com', 'employee', '2026-09-06 11:10:09.014+00', '2026-09-06 11:10:09.014+00', true) ON CONFLICT DO NOTHING;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_user
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict eVg22iH0xnwoT0kCsDUbWwEWhgL43QmuCQrjuhxcNsbEWVaPpjUbTe4a8LVB5Zd


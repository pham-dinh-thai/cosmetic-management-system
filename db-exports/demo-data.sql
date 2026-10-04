-- DU LIEU TOI THIEU cho he thong chay. Schema va quyen do migration tu tao,
-- nen restore file nay SAU khi 'docker compose up -d' da chay xong.

\connect cosmetic_audit_service
--
-- PostgreSQL database dump
--

\restrict ivIYFdQJqebvpJiPNSk6fY1i1Qm46fG1gjbpdr79swRiUFaLEbBsPeJ4pnLRNEq

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_audit
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict ivIYFdQJqebvpJiPNSk6fY1i1Qm46fG1gjbpdr79swRiUFaLEbBsPeJ4pnLRNEq


\connect cosmetic_authentication_service
--
-- PostgreSQL database dump
--

\restrict uTxJ1V3eRljn0DHwZ8v4PVAo8ROt4b6uJg775niBW1tMeQkgb77mDAp8z6nFeiP

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_auth
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict uTxJ1V3eRljn0DHwZ8v4PVAo8ROt4b6uJg775niBW1tMeQkgb77mDAp8z6nFeiP


\connect cosmetic_authorization_service
--
-- PostgreSQL database dump
--

\restrict MjGTNdjGZpZOrbCQWQMlvRnOnQ0VvWH9fo9Akgkg1rXt0xWT11jO5JtFfjtSQMX

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_authorization
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 9, true);


--
-- PostgreSQL database dump complete
--

\unrestrict MjGTNdjGZpZOrbCQWQMlvRnOnQ0VvWH9fo9Akgkg1rXt0xWT11jO5JtFfjtSQMX


\connect cosmetic_basket_service
--
-- PostgreSQL database dump
--

\restrict IhiMv0gDlobaKtyZxjfNATMksp1r5nnafUfmH1kv0t098n7BjUD7DsjKXI6wM51

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_basket
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict IhiMv0gDlobaKtyZxjfNATMksp1r5nnafUfmH1kv0t098n7BjUD7DsjKXI6wM51


\connect cosmetic_category_service
--
-- PostgreSQL database dump
--

\restrict 7M0LkCBIdfoKaSBoeu5AblVRm1nyq7k557Yf8L7BcbdqFeAG4CPKZrhv4mrg6fg

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

COPY public.categories (id, name, description, is_active, created_at, updated_at) FROM stdin;
11111111-1111-4111-8111-111111111102	Kem Nền & Cushion	Kem nền, cushion che phủ hoàn hảo cho làn da	t	2026-09-07 13:53:38.797656+00	2026-09-07 13:53:38.797656+00
11111111-1111-4111-8111-111111111103	Trang Điểm Mắt	Mascara, kẻ mắt, phấn mắt nâng tầm đôi mắt	t	2026-09-07 13:53:38.797656+00	2026-09-07 13:53:38.797656+00
11111111-1111-4111-8111-111111111104	Phấn Má & Phấn Phủ	Phấn phủ, phấn má cho khuôn mặt tươi tắn	t	2026-09-07 13:53:38.797656+00	2026-09-07 13:53:38.797656+00
11111111-1111-4111-8111-111111111105	Sữa Rửa Mặt & Tẩy Trang	Làm sạch dịu nhẹ, tẩy trang chuyên sâu	t	2026-09-07 13:53:38.797656+00	2026-09-07 13:53:38.797656+00
11111111-1111-4111-8111-111111111106	Serum & Tinh Chất	Serum đặc trị, dưỡng sâu phục hồi da	t	2026-09-07 13:53:38.797656+00	2026-09-07 13:53:38.797656+00
11111111-1111-4111-8111-111111111107	Kem Dưỡng Ẩm	Kem dưỡng ẩm, phục hồi hàng rào bảo vệ da	t	2026-09-07 13:53:38.797656+00	2026-09-07 13:53:38.797656+00
11111111-1111-4111-8111-111111111108	Kem Chống Nắng	Chống nắng SPF cao, bảo vệ da mỗi ngày	t	2026-09-07 13:53:38.797656+00	2026-09-07 13:53:38.797656+00
11111111-1111-4111-8111-111111111109	Combo & Bộ Sản Phẩm	Set sản phẩm tiết kiệm cho quy trình skincare	t	2026-09-07 13:53:38.797656+00	2026-09-07 13:53:38.797656+00
11111111-1111-4111-8111-111111111101	Son Môi	Son thỏi, son lì, son kem cho đôi môi nổi bật	t	2026-09-07 13:53:38.797656+00	2026-09-09 09:26:37.995+00
0e69d090-564e-4ce6-8b64-364e3813d9af	ABC	\N	f	2026-09-22 20:13:34.996+00	2026-09-22 20:13:36.792+00
e8bbc3cc-9e18-4066-98be-71141e730d4e	Nước hoa	\N	t	2026-09-23 04:21:13.854+00	2026-09-23 04:21:13.854+00
ab575a05-ec6a-4152-8d1e-df8a896fae2d	j	\N	f	2026-09-24 05:55:16.061+00	2026-09-24 05:57:08.461+00
0791bfb1-92ec-41b0-a690-d97525887e10	a	\N	f	2026-09-24 05:57:06.98+00	2026-09-24 05:57:09.103+00
\.


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_category
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 7M0LkCBIdfoKaSBoeu5AblVRm1nyq7k557Yf8L7BcbdqFeAG4CPKZrhv4mrg6fg


\connect cosmetic_cosmetic_service
--
-- PostgreSQL database dump
--

\restrict 7B4r8k7M6xyamltt2gRMT7TJIIH2GbxE7CtadRcqRhizBPABbuSScKoCafaLiO2

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

COPY public.cosmetics (id, code, name, brand, origin, description, image_url, is_active, created_at, updated_at) FROM stdin;
33333333-3333-4333-8333-333333333201	SP_00001	Son Kem Lì 3CE Mood Matte Lip Tint	3CE	Hàn Quốc	Son kem lì với chất son mịn mượt, khô nhanh, màu lên chuẩn, bền màu suốt cả ngày. Hương son nhẹ nhàng, kết cấu không làm khô môi.	\N	t	2026-09-01 09:00:00+00	2026-09-01 09:00:00+00
33333333-3333-4333-8333-333333333202	SP_00002	Son Thỏi Dior Rouge Dior 999 Matte	Dior	Pháp	Biểu tượng son đỏ của Dior với phiên bản lì cao cấp. Chất son nhung mềm, độ che phủ cao, màu đỏ quyền lực kinh điển phù hợp mọi tông da.	\N	t	2026-09-01 09:05:00+00	2026-09-01 09:05:00+00
33333333-3333-4333-8333-333333333203	SP_00003	Kem Nền Laneige Neo Cushion Glow	Laneige	Hàn Quốc	Cushion cho da căng bóng tự nhiên với độ che phủ trung bình, dưỡng ẩm sâu, lớp nền mỏng nhẹ không bết. Công nghệ khóa ẩm suốt 24h.	\N	t	2026-09-01 09:10:00+00	2026-09-01 09:10:00+00
33333333-3333-4333-8333-333333333204	SP_00004	Kem Nền Maybelline Fit Me Matte Poreless	Maybelline New York	Mỹ	Kem nền làm mờ lỗ chân lông, kiểm soát dầu nhờn, lớp nền lì mịn tự nhiên. Công thức không gây bít tắc, phù hợp da dầu và da hỗn hợp.	\N	t	2026-09-01 09:15:00+00	2026-09-01 09:15:00+00
33333333-3333-4333-8333-333333333205	SP_00005	Phấn Phủ Innisfree No-Sebum Mineral Powder	Innisfree	Hàn Quốc	Phấn phủ khoáng kiểm soát dầu vượt trội, giữ lớp trang điểm bền 12h. Thành phần chiết xuất từ trà xanh Jeju lành tính cho da nhạy cảm.	\N	t	2026-09-01 09:20:00+00	2026-09-01 09:20:00+00
33333333-3333-4333-8333-333333333206	SP_00006	Má Hồng The Face Shop Lovely Me EX Blusher	The Face Shop	Hàn Quốc	Phấn má hồng dạng compact với chất phấn tan đều, tạo gò má ửng hồng tự nhiên. Bảng màu tươi sáng phù hợp mọi tông da.	\N	t	2026-09-01 09:25:00+00	2026-09-01 09:25:00+00
33333333-3333-4333-8333-333333333207	SP_00007	Mascara Loreal Paris Volume Million Lashes	LOREAL Paris	Pháp	Mascara tạo mi dày gấp triệu lần từ gốc đến ngọn, chổi thiết kế 3D giúp tách từng sợi mi, không bết, lâu trôi.	\N	t	2026-09-01 09:30:00+00	2026-09-01 09:30:00+00
33333333-3333-4333-8333-333333333208	SP_00008	Mascara Chống Nước The Face Shop Extreme Curl	The Face Shop	Hàn Quốc	Mascara cong mi siêu giữ nếp, chống nước, chống thấm tốt, phù hợp ngày mưa và đi biển. Chổi uốn cong giúp tạo mi dày cong tự nhiên.	\N	t	2026-09-01 09:35:00+00	2026-09-01 09:35:00+00
33333333-3333-4333-8333-333333333209	SP_00009	Sữa Rửa Mặt Hada Labo Gokujyun Foaming	Hada Labo	Nhật Bản	Sữa rửa mặt bọt dày đặc giàu 3 loại Hyaluronic Acid, làm sạch sâu nhưng không khô căng da, cân bằng độ ẩm tự nhiên.	\N	t	2026-09-01 09:40:00+00	2026-09-01 09:40:00+00
33333333-3333-4333-8333-333333333210	SP_00010	Tẩy Trang The Face Shop Rice Water Bright Cleansing Oil	The Face Shop	Hàn Quốc	Dầu tẩy trang chiết xuất nước gạo làm sạch lớp trang điểm và bụi bẩn, giúp da sáng mịn tự nhiên không làm khô da.	\N	t	2026-09-01 09:45:00+00	2026-09-01 09:45:00+00
33333333-3333-4333-8333-333333333211	SP_00011	Serum Laneige Water Bank Blue Hyaluronic	Laneige	Hàn Quốc	Serum cấp ẩm chuyên sâu với phức hợp Hyaluronic 5 lớp, cung cấp nước cho da mềm mịn, giảm tình trạng khô ráp và bong tróc.	\N	t	2026-09-01 09:50:00+00	2026-09-01 09:50:00+00
33333333-3333-4333-8333-333333333212	SP_00012	Serum Trà Xanh Innisfree Green Tea Seed	Innisfree	Hàn Quốc	Serum đặc trị với hạt trà xanh Jeju tươi giàu axit amin, cấp ẩm tức thì và phục hồi da dầu thiếu nước, se lỗ chân lông.	\N	t	2026-09-01 09:55:00+00	2026-09-01 09:55:00+00
380b92b6-8ccf-4076-b747-857ac543c4a5	SP_00019	Công nghệ thông tin	Innisfree	Hàn Quốc	a	\N	f	2026-09-22 20:35:54.102+00	2026-09-22 20:36:40.933+00
a3f06b63-375c-4916-9a6e-f40646f33367	SP_00021	Nước hoa xyz	Begone	Mỹ	Nước hoa xyz	\N	t	2026-09-23 04:20:23.844+00	2026-09-23 04:20:45.535+00
33333333-3333-4333-8333-333333333213	SP_00013	Kem Dưỡng Ẩm CeraVe Moisturizing Cream	CeraVe	Mỹ	Kem dưỡng ẩm với 3 ceramide thiết yếu, phục hồi hàng rào bảo vệ da, dưỡng ẩm suốt 24h cho da khô và da nhạy cảm.	\N	t	2026-09-01 10:00:00+00	2026-09-09 08:24:32.896+00
33333333-3333-4333-8333-333333333214	SP_00014	Kem Chống Nắng La Roche-Posay Anthelios XL Dry Touch	La Roche-Posay	Pháp	Kem chống nắng SPF50+ PA++++ quang phổ rộng, kết cấu khô thoáng, không bết dính, an toàn cho da nhạy cảm và da mụn.	\N	f	2026-09-01 10:05:00+00	2026-09-23 04:20:56.21+00
6279af9d-8f11-4984-8967-58d9498b4518	SP_00016	Sữa rửa mặt	Innisfree	Hàn Quốc	Sữa rửa mặt Hàn Quốc	\N	t	2026-09-07 19:56:20.89+00	2026-09-09 09:26:49.135+00
9f01c5e6-eef6-4ccd-931a-009d5863c858	SP_00018	Sữa rửa mặt xyz	Justice	Hàn Quốc	Sữa rửa mặt	\N	f	2026-09-22 20:12:32.004+00	2026-09-22 20:13:18.12+00
33333333-3333-4333-8333-333333333215	SP_00015	Combo Chăm Sóc Da Cơ Bản Innisfree Green Tea	Innisfree	Việt Nam	Bộ sản phẩm gồm sữa rửa mặt, nước hoa hồng và serum trà xanh Green Tea, tiết kiệm 20% cho quy trình skincare buổi sáng và tối.	\N	t	2026-09-01 10:10:00+00	2026-09-07 19:55:30.64+00
b118e8c0-607a-4cac-a3e9-ad03d7ed9514	SP_00017	Sữa rửa mặt abc	Innisfree	Hàn Quốc	abc 234	\N	f	2026-09-16 06:31:05.345+00	2026-09-22 20:44:16.617+00
0cb7b95a-5ce7-4b54-9a25-a86c9b67faee	SP_00020	Sữa rửa mặt 2	Justice	Hàn Quốc	Sữa rửa mặt xuất sứ Hàn Quốc	\N	t	2026-09-22 20:45:40.291+00	2026-09-22 20:45:40.291+00
\.


--
-- Data for Name: cosmetic_categories; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

COPY public.cosmetic_categories (id, cosmetic_id, category_id, created_at) FROM stdin;
66aaaa11-1111-4111-8111-111111111201	33333333-3333-4333-8333-333333333201	11111111-1111-4111-8111-111111111101	2026-09-01 10:15:00+00
66aaaa11-1111-4111-8111-111111111202	33333333-3333-4333-8333-333333333202	11111111-1111-4111-8111-111111111101	2026-09-01 10:20:00+00
66aaaa11-1111-4111-8111-111111111203	33333333-3333-4333-8333-333333333203	11111111-1111-4111-8111-111111111102	2026-09-01 10:25:00+00
66aaaa11-1111-4111-8111-111111111204	33333333-3333-4333-8333-333333333204	11111111-1111-4111-8111-111111111102	2026-09-01 10:30:00+00
66aaaa11-1111-4111-8111-111111111205	33333333-3333-4333-8333-333333333205	11111111-1111-4111-8111-111111111104	2026-09-01 10:35:00+00
66aaaa11-1111-4111-8111-111111111206	33333333-3333-4333-8333-333333333206	11111111-1111-4111-8111-111111111104	2026-09-01 10:40:00+00
66aaaa11-1111-4111-8111-111111111207	33333333-3333-4333-8333-333333333207	11111111-1111-4111-8111-111111111103	2026-09-01 10:45:00+00
66aaaa11-1111-4111-8111-111111111208	33333333-3333-4333-8333-333333333208	11111111-1111-4111-8111-111111111103	2026-09-01 10:50:00+00
66aaaa11-1111-4111-8111-111111111209	33333333-3333-4333-8333-333333333209	11111111-1111-4111-8111-111111111105	2026-09-01 10:55:00+00
66aaaa11-1111-4111-8111-111111111210	33333333-3333-4333-8333-333333333210	11111111-1111-4111-8111-111111111105	2026-09-01 11:00:00+00
66aaaa11-1111-4111-8111-111111111211	33333333-3333-4333-8333-333333333211	11111111-1111-4111-8111-111111111106	2026-09-01 11:05:00+00
66aaaa11-1111-4111-8111-111111111212	33333333-3333-4333-8333-333333333212	11111111-1111-4111-8111-111111111106	2026-09-01 11:10:00+00
1f56b25c-813a-49ed-bfc1-752804da3ad8	33333333-3333-4333-8333-333333333214	11111111-1111-4111-8111-111111111108	2026-09-07 17:22:43.237+00
0f90df4c-3907-4029-9755-ca819c3e99ed	33333333-3333-4333-8333-333333333215	11111111-1111-4111-8111-111111111109	2026-09-07 19:55:30.639+00
62fb5979-4c1a-4474-84f8-157e7a955e20	6279af9d-8f11-4984-8967-58d9498b4518	11111111-1111-4111-8111-111111111101	2026-09-07 19:56:30.144+00
d5803b54-246c-4025-a0f1-82e4a1f58586	6279af9d-8f11-4984-8967-58d9498b4518	11111111-1111-4111-8111-111111111102	2026-09-07 19:56:30.144+00
0070d378-732e-437a-b794-ef359bbff0f6	6279af9d-8f11-4984-8967-58d9498b4518	11111111-1111-4111-8111-111111111107	2026-09-07 19:56:30.144+00
6af6c231-5e6a-40d1-b22b-f2731005ae4a	33333333-3333-4333-8333-333333333213	11111111-1111-4111-8111-111111111107	2026-09-09 08:24:32.895+00
d07bff5a-7630-46c5-8506-ace176f4435b	b118e8c0-607a-4cac-a3e9-ad03d7ed9514	11111111-1111-4111-8111-111111111105	2026-09-16 06:31:05.351+00
49aa0826-d00f-4267-b376-779c5291afd7	b118e8c0-607a-4cac-a3e9-ad03d7ed9514	11111111-1111-4111-8111-111111111106	2026-09-16 06:31:05.352+00
3716d554-4af6-46d9-a19b-19f8e90e288a	9f01c5e6-eef6-4ccd-931a-009d5863c858	11111111-1111-4111-8111-111111111109	2026-09-22 20:12:32.006+00
4a36f7e3-b4a1-4a94-a87c-7422c0a6ce70	380b92b6-8ccf-4076-b747-857ac543c4a5	11111111-1111-4111-8111-111111111103	2026-09-22 20:35:54.103+00
88f5a290-0f10-4ca0-8c38-08fee64c5b17	380b92b6-8ccf-4076-b747-857ac543c4a5	11111111-1111-4111-8111-111111111108	2026-09-22 20:35:54.103+00
d918adda-4b9f-4cbe-927c-4d2455466bcb	0cb7b95a-5ce7-4b54-9a25-a86c9b67faee	11111111-1111-4111-8111-111111111109	2026-09-22 20:45:40.291+00
d91d8d60-ffe5-4f92-805c-1361f26b765e	a3f06b63-375c-4916-9a6e-f40646f33367	11111111-1111-4111-8111-111111111109	2026-09-23 04:20:45.535+00
0e6ea13e-2ba5-4fe7-bb3a-7237d8495a96	a3f06b63-375c-4916-9a6e-f40646f33367	11111111-1111-4111-8111-111111111103	2026-09-23 04:20:45.535+00
792fc077-567a-47a8-b735-e728441e440a	a3f06b63-375c-4916-9a6e-f40646f33367	11111111-1111-4111-8111-111111111104	2026-09-23 04:20:45.535+00
25e128f5-c5d4-4a8a-a70c-b821ad9b1db9	a3f06b63-375c-4916-9a6e-f40646f33367	11111111-1111-4111-8111-111111111105	2026-09-23 04:20:45.535+00
\.


--
-- Data for Name: cosmetic_variants; Type: TABLE DATA; Schema: public; Owner: cosmetic_cosmetic
--

COPY public.cosmetic_variants (id, cosmetic_id, name, color, volume, price, cost_price, is_active, created_at, updated_at) FROM stdin;
44444444-4444-4444-8444-444444444201	33333333-3333-4333-8333-333333333201	Son Tint Rosy Red	Rosy Red	10ml	590000.00	430000.00	t	2026-09-01 10:15:00+00	2026-09-01 10:15:00+00
44444444-4444-4444-8444-444444444202	33333333-3333-4333-8333-333333333201	Son Tint Peach Go	Peach Go	10ml	590000.00	430000.00	t	2026-09-01 10:15:00+00	2026-09-01 10:15:00+00
44444444-4444-4444-8444-444444444203	33333333-3333-4333-8333-333333333202	Dior 999  #9 Rouge	Rouge	3.5g	980000.00	760000.00	t	2026-09-01 10:20:00+00	2026-09-01 10:20:00+00
44444444-4444-4444-8444-444444444204	33333333-3333-4333-8333-333333333203	Cushion 21N Vanilla	Vanilla	15g	850000.00	650000.00	t	2026-09-01 10:25:00+00	2026-09-01 10:25:00+00
44444444-4444-4444-8444-444444444205	33333333-3333-4333-8333-333333333203	Cushion 23N Sand	Sand	15g	850000.00	650000.00	t	2026-09-01 10:25:00+00	2026-09-01 10:25:00+00
44444444-4444-4444-8444-444444444206	33333333-3333-4333-8333-333333333204	Fit Me 120 Classic Ivory	Ivory	30ml	290000.00	210000.00	t	2026-09-01 10:30:00+00	2026-09-01 10:30:00+00
44444444-4444-4444-8444-444444444207	33333333-3333-4333-8333-333333333204	Fit Me 220 Natural Beige	Natural Beige	30ml	290000.00	210000.00	t	2026-09-01 10:30:00+00	2026-09-01 10:30:00+00
44444444-4444-4444-8444-444444444208	33333333-3333-4333-8333-333333333205	Phấn 04 Transparent	Transparent	5g	320000.00	240000.00	t	2026-09-01 10:35:00+00	2026-09-01 10:35:00+00
44444444-4444-4444-8444-444444444209	33333333-3333-4333-8333-333333333206	Má RO2 Pink	Pink	4g	200000.00	140000.00	t	2026-09-01 10:40:00+00	2026-09-01 10:40:00+00
44444444-4444-4444-8444-444444444210	33333333-3333-4333-8333-333333333206	Má OR1 Peach	Peach	4g	200000.00	140000.00	t	2026-09-01 10:40:00+00	2026-09-01 10:40:00+00
44444444-4444-4444-8444-444444444211	33333333-3333-4333-8333-333333333207	Noir Volume	Noir	9.2ml	380000.00	290000.00	t	2026-09-01 10:45:00+00	2026-09-01 10:45:00+00
44444444-4444-4444-8444-444444444212	33333333-3333-4333-8333-333333333208	Extreme Curl Black	Black	8ml	250000.00	180000.00	t	2026-09-01 10:50:00+00	2026-09-01 10:50:00+00
44444444-4444-4444-8444-444444444213	33333333-3333-4333-8333-333333333209	Foaming Cleanser	Trắng	160g	190000.00	140000.00	t	2026-09-01 10:55:00+00	2026-09-01 10:55:00+00
44444444-4444-4444-8444-444444444214	33333333-3333-4333-8333-333333333210	Light Cleansing Oil	Trắng	150ml	350000.00	250000.00	t	2026-09-01 11:00:00+00	2026-09-01 11:00:00+00
44444444-4444-4444-8444-444444444215	33333333-3333-4333-8333-333333333211	Blue Hyaluronic Serum	Trắng	30ml	720000.00	540000.00	t	2026-09-01 11:05:00+00	2026-09-01 11:05:00+00
44444444-4444-4444-8444-444444444216	33333333-3333-4333-8333-333333333212	Green Tea Seed Serum	Xanh	80ml	690000.00	500000.00	t	2026-09-01 11:10:00+00	2026-09-01 11:10:00+00
44444444-4444-4444-8444-444444444217	33333333-3333-4333-8333-333333333213	Moisturizing Cream 454g	Trắng	454g	520000.00	390000.00	t	2026-09-01 11:15:00+00	2026-09-01 11:15:00+00
44444444-4444-4444-8444-444444444218	33333333-3333-4333-8333-333333333214	Anthelios SPF50+ 50ml	Trắng	50ml	680000.00	510000.00	t	2026-09-01 11:20:00+00	2026-09-01 11:20:00+00
44444444-4444-4444-8444-444444444219	33333333-3333-4333-8333-333333333215	Combo Set Green Tea	Xanh	Set	1450000.00	1100000.00	t	2026-09-01 11:25:00+00	2026-09-01 11:25:00+00
a81acf0f-952e-420c-8901-2d80ab558335	6279af9d-8f11-4984-8967-58d9498b4518	Mặc định	Xanh rêu	50ml	100000.00	80000.00	t	2026-09-07 19:56:20.891+00	2026-09-09 08:35:32.467+00
66023e10-1861-4d27-8db5-63c490075bf2	9f01c5e6-eef6-4ccd-931a-009d5863c858	Mặc định	xanh	\N	200000.00	179999.00	t	2026-09-22 20:12:32.005+00	2026-09-22 20:12:32.005+00
c284efc7-3cee-4fe8-96ed-63ea81726a26	9f01c5e6-eef6-4ccd-931a-009d5863c858	Màu hồng	hồng	\N	200000.00	180000.00	t	2026-09-22 20:13:06.552+00	2026-09-22 20:13:06.552+00
12d8b89d-c64f-4c75-97be-aeb646927068	b118e8c0-607a-4cac-a3e9-ad03d7ed9514	Mặc định 1	xanh	50ml	190000.00	180000.00	t	2026-09-16 06:31:05.349+00	2026-09-22 20:35:22.246+00
395100cd-2bf3-4e27-b62a-c29bb1c77608	380b92b6-8ccf-4076-b747-857ac543c4a5	Mặc định	\N	\N	200000.00	180000.00	t	2026-09-22 20:35:54.103+00	2026-09-22 20:35:54.103+00
2186e3ff-43d8-49db-8bb8-1a810b3af0cb	0cb7b95a-5ce7-4b54-9a25-a86c9b67faee	Màu xanh	Xanh	\N	200000.00	180005.00	t	2026-09-22 20:45:40.291+00	2026-09-22 20:45:40.291+00
cc540b65-6878-44cf-aa4c-8da433aef312	0cb7b95a-5ce7-4b54-9a25-a86c9b67faee	Màu đỏ	Đỏ	\N	200000.00	1800000.00	t	2026-09-22 20:45:40.291+00	2026-09-22 20:45:49+00
d7550203-2927-49ab-bb4e-3a62350465e1	a3f06b63-375c-4916-9a6e-f40646f33367	Mặc định	cam	100ml	200000.00	150000.00	t	2026-09-23 04:20:23.845+00	2026-09-23 04:20:23.845+00
5baa66a5-e270-4095-a6f9-fa92edf4a75c	a3f06b63-375c-4916-9a6e-f40646f33367	50ml	cam	50ml	100000.00	70000.00	t	2026-09-23 04:20:23.845+00	2026-09-23 04:20:23.845+00
\.


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_cosmetic
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 7B4r8k7M6xyamltt2gRMT7TJIIH2GbxE7CtadRcqRhizBPABbuSScKoCafaLiO2


\connect cosmetic_customer_service
--
-- PostgreSQL database dump
--

\restrict ElUyF9H5eUohUOogUCrqDeVuzmLbchl3nl48fIQF6e4vzenYkIjpCPQi8aFw7VL

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_customer
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict ElUyF9H5eUohUOogUCrqDeVuzmLbchl3nl48fIQF6e4vzenYkIjpCPQi8aFw7VL


\connect cosmetic_department_service
--
-- PostgreSQL database dump
--

\restrict J4HtHxb5FOrJc8X4Vd6ddAvGSDk3dcGe3wZSt8jocNAd7mtOUddTgicERlfhN98

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

COPY public.departments (id, name, manager_id, created_at, updated_at, code, is_active) FROM stdin;
8e49017e-fd08-4f7f-beb2-a9650bbe441a	Kho 2	\N	2026-09-15 03:53:48.481+00	2026-09-15 12:50:54.649+00	warehouse-	f
a5901ae5-860b-4a73-91ab-919e51bcb7fa	sađấ	\N	2026-09-15 03:54:11.928+00	2026-09-15 12:50:55.499+00	warehouse2	f
9dc11f7d-7f0d-4151-b598-b5cad73cd6bc	áđasad	\N	2026-09-15 03:54:21.517+00	2026-09-15 12:50:55.954+00	psađạo-2	f
d37b1cc6-48e6-445a-b3b4-518d72fd3bc7	Kinh Doanh	efc4a610-df79-4e73-b52d-d3f720498d61	2026-09-06 11:07:01.736+00	2026-09-15 16:44:16.159+00	sales	t
ba794014-91d9-459b-aa0f-83d330313947	Công nghệ thông tin	6a80152b-ee2f-47e4-9bda-19db665d6db8	2026-09-06 06:20:01.257+00	2026-09-15 16:49:28.648+00	IT	t
95dcaa9a-52b4-4aac-8d93-4a3a1a62c1f6	Kho	1a80fe7b-2d50-4d24-b58d-6f7957201a29	2026-09-06 09:22:17.75+00	2026-09-19 05:37:50.849+00	warehouse	t
7a3c09ab-6b62-4aa9-8d49-e60700fe8680	Kế toán	\N	2026-09-09 09:17:27.497+00	2026-09-24 08:23:36.306+00	accountant	t
\.


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_department
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict J4HtHxb5FOrJc8X4Vd6ddAvGSDk3dcGe3wZSt8jocNAd7mtOUddTgicERlfhN98


\connect cosmetic_employee_service
--
-- PostgreSQL database dump
--

\restrict S77VrqnniYg07vinWdgU7GHbQs2SmJXKdwU4FnGvxugCFAUD7OAKpuja2II1FKQ

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_employee
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

\unrestrict S77VrqnniYg07vinWdgU7GHbQs2SmJXKdwU4FnGvxugCFAUD7OAKpuja2II1FKQ


\connect cosmetic_inventory_service
--
-- PostgreSQL database dump
--

\restrict w8E3CD4I88pI79De05nscbHa7fgem2OEc9eQg5w1UHzwiYNGdgOimnmaMak2GJR

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

COPY public.inventories (id, variant_id, created_at, updated_at, min_stock, is_active, created_by) FROM stdin;
f765ca59-6135-4103-b628-5d8b62c51325	44444444-4444-4444-8444-444444444218	2026-09-22 06:15:34.4+00	2026-09-22 06:15:34.4+00	0	t	\N
62ad2c1b-4311-444b-b545-2fcd1b5bd05c	5baa66a5-e270-4095-a6f9-fa92edf4a75c	2026-09-23 04:23:02.368+00	2026-09-23 04:23:02.474+00	23	t	\N
15f52b2b-ac7f-42b7-a980-bfb25b626f60	d7550203-2927-49ab-bb4e-3a62350465e1	2026-09-23 04:23:02.346+00	2026-09-23 04:26:49.582+00	23	t	\N
5accce36-ca28-4662-b18e-8a62cc385619	44444444-4444-4444-8444-444444444201	2026-09-14 18:24:57.579+00	2026-10-02 07:34:31.997+00	20	t	\N
6d12bf47-435f-40b0-ac49-33cf56b4e4d8	44444444-4444-4444-8444-444444444208	2026-09-14 17:43:27.085+00	2026-10-02 08:21:53.097+00	20	t	\N
\.


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_inventory
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 8, true);


--
-- PostgreSQL database dump complete
--

\unrestrict w8E3CD4I88pI79De05nscbHa7fgem2OEc9eQg5w1UHzwiYNGdgOimnmaMak2GJR


\connect cosmetic_invoice_service
--
-- PostgreSQL database dump
--

\restrict Wai6eEvjH3R7aDUtFuslYCfh47MyrfhcBMFdiEiefg9Dz7tWbC87OGLfqQNbLhM

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_invoice
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Wai6eEvjH3R7aDUtFuslYCfh47MyrfhcBMFdiEiefg9Dz7tWbC87OGLfqQNbLhM


\connect cosmetic_notification_service
--
-- PostgreSQL database dump
--

\restrict tDjTUflsC3X4D4gRZecVg6NwgWvsVhlamcsKiGZdmj08ege0GFZgA8m6hsdDFBB

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_notification
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict tDjTUflsC3X4D4gRZecVg6NwgWvsVhlamcsKiGZdmj08ege0GFZgA8m6hsdDFBB


\connect cosmetic_order_service
--
-- PostgreSQL database dump
--

\restrict 0ouDqoRP3RZjAlHFJfMVVOYxg525VZk77qOYBgPzyvyB76dMMzFoPxz7Lovh8ts

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_order
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 0ouDqoRP3RZjAlHFJfMVVOYxg525VZk77qOYBgPzyvyB76dMMzFoPxz7Lovh8ts


\connect cosmetic_purchase_service
--
-- PostgreSQL database dump
--

\restrict Xy1cmwQlQhAxxYpFgdv7QtgFhGcoZCbXHqb7r0zw42RgkCdw5ucXmUVKn873KMn

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_purchase
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Xy1cmwQlQhAxxYpFgdv7QtgFhGcoZCbXHqb7r0zw42RgkCdw5ucXmUVKn873KMn


\connect cosmetic_receipt_service
--
-- PostgreSQL database dump
--

\restrict avnJLdpbNkJ5Rg71YWIdWElIuw8rI5KQaMSZyR6bUPPTzWI83GxCer1Ff3DobNW

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_receipt
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict avnJLdpbNkJ5Rg71YWIdWElIuw8rI5KQaMSZyR6bUPPTzWI83GxCer1Ff3DobNW


\connect cosmetic_supplier_service
--
-- PostgreSQL database dump
--

\restrict TaWTTxEseTpg7Cp9fpVqQei8m4hoigODJHCR2S3LZv2GpNTeVacJ2dnch89nUWA

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_supplier
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict TaWTTxEseTpg7Cp9fpVqQei8m4hoigODJHCR2S3LZv2GpNTeVacJ2dnch89nUWA


\connect cosmetic_user_service
--
-- PostgreSQL database dump
--

\restrict hndfSl402Ie5RcdjKIcq3GgJVq3jLi0Owf0w3eQwXDcQEb7LT1d2k5CN7tJtJ0o

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
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cosmetic_user
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict hndfSl402Ie5RcdjKIcq3GgJVq3jLi0Owf0w3eQwXDcQEb7LT1d2k5CN7tJtJ0o


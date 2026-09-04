-- ============================================================================
-- HE THONG QUAN LY MY PHAM - SCRIPT CO SO DU LIEU (SCHEMA)
-- Backend: NestJS + MikroORM + PostgreSQL
-- File nay mo ta TOAN BO cau truc 13 database nghiep vu (I..XII):
--   Primary Key, Foreign Key, Unique constraint, Check constraint, Not Null, Default.
-- ============================================================================

-- ============================================================================
-- I. NGUOI DUNG (USER)
-- Database: cosmetic_user_service
-- ============================================================================

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

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- ============================================================================
-- II. AUTHENTICATION / AUTHORIZATION
-- Database: cosmetic_authentication_service
-- ============================================================================

CREATE TABLE public.auth_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    password character varying(255) NOT NULL,
    email_verified_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_user_id_unique UNIQUE (user_id);

-- ============================================================================
-- III. PHONG BAN (DEPARTMENT)
-- Database: cosmetic_department_service
-- ============================================================================

CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    manager_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    code character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_unique UNIQUE (code);

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_unique UNIQUE (name);

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);

-- ============================================================================
-- IV. NHAN VIEN (EMPLOYEE)
-- Database: cosmetic_employee_service
-- ============================================================================

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

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_code_unique UNIQUE (code);

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_unique UNIQUE (user_id);

-- ============================================================================
-- V. KHACH HANG (CUSTOMER)
-- Database: cosmetic_customer_service
-- ============================================================================

CREATE TABLE public.addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    city character varying(255) NOT NULL,
    street character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE public.phones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    phone character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_code_unique UNIQUE (code);

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_unique UNIQUE (user_id);

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_phone_unique UNIQUE (phone);

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

-- ============================================================================
-- VI. DANH MUC (CATEGORY)
-- Database: cosmetic_category_service
-- ============================================================================

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_unique UNIQUE (name);

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

-- ============================================================================
-- VII. NHA CUNG CAP (SUPPLIER)
-- Database: cosmetic_supplier_service
-- ============================================================================

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

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_code_unique UNIQUE (code);

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_email_unique UNIQUE (email);

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);

-- ============================================================================
-- VIII. SAN PHAM MY PHAM (COSMETIC)
-- Database: cosmetic_cosmetic_service
-- ============================================================================

CREATE TABLE public.cosmetic_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cosmetic_id uuid NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);

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

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.cosmetic_categories
    ADD CONSTRAINT cosmetic_categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cosmetic_variants
    ADD CONSTRAINT cosmetic_variants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cosmetics
    ADD CONSTRAINT cosmetics_code_unique UNIQUE (code);

ALTER TABLE ONLY public.cosmetics
    ADD CONSTRAINT cosmetics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cosmetic_categories
    ADD CONSTRAINT cosmetic_categories_cosmetic_id_foreign FOREIGN KEY (cosmetic_id) REFERENCES public.cosmetics(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cosmetic_variants
    ADD CONSTRAINT cosmetic_variants_cosmetic_id_foreign FOREIGN KEY (cosmetic_id) REFERENCES public.cosmetics(id) ON DELETE CASCADE;

-- ============================================================================
-- IX. TON KHO (INVENTORY)
-- Database: cosmetic_inventory_service
-- ============================================================================

CREATE TABLE public.inventories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    variant_id character varying(255) NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    last_updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT inventories_quantity_check CHECK ((quantity >= 0))
);

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT inventories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT inventories_variant_id_unique UNIQUE (variant_id);

-- ============================================================================
-- X. NHAP HANG (PURCHASE ORDER)
-- Database: cosmetic_purchase_service
-- ============================================================================

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

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_code_unique UNIQUE (code);

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.purchase_transactions
    ADD CONSTRAINT purchase_transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_purchase_order_id_foreign FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.purchase_transactions
    ADD CONSTRAINT purchase_transactions_purchase_order_id_foreign FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;

-- ============================================================================
-- XI. BAN HANG (ORDER)
-- Database: cosmetic_order_service
-- ============================================================================

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

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.order_lines
    ADD CONSTRAINT order_lines_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.order_transactions
    ADD CONSTRAINT order_transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_code_unique UNIQUE (code);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.order_lines
    ADD CONSTRAINT order_lines_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.order_transactions
    ADD CONSTRAINT order_transactions_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

-- ============================================================================
-- XII. HOA DON (INVOICE)
-- Database: cosmetic_invoice_service
-- ============================================================================

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

-- ---- Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) ----

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_code_unique UNIQUE (code);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_unique UNIQUE (order_id);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


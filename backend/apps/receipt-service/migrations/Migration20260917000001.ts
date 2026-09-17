import { Migration } from '@mikro-orm/migrations';

export class Migration20260917000001 extends Migration {
  override name = 'Migration20260917000001';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "receipts" ("id" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "amount" numeric(12,2) not null default 0, "source" text not null default 'MANUAL', "invoice_id" varchar(255) null, "customer_id" varchar(255) null, "note" varchar(255) null, "employee_id" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "receipts" add constraint "receipts_code_unique" unique ("code");`,
    );
    this.addSql(
      `alter table "receipts" add constraint "receipts_source_check" check ("source" in ('MANUAL', 'AUTO_INVOICE_PAYMENT'));`,
    );
    this.addSql(
      `alter table "receipts" add constraint "receipts_amount_check" check ("amount" >= 0);`,
    );

    this.addSql(
      `create table "payments" ("id" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "amount" numeric(12,2) not null default 0, "category" text not null default 'OTHER', "source" text not null default 'MANUAL', "purchase_order_id" varchar(255) null, "supplier_id" varchar(255) null, "note" varchar(255) null, "employee_id" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "payments" add constraint "payments_code_unique" unique ("code");`,
    );
    this.addSql(
      `alter table "payments" add constraint "payments_category_check" check ("category" in ('SUPPLIER', 'SALARY', 'INFRASTRUCTURE', 'MATERIAL', 'OTHER'));`,
    );
    this.addSql(
      `alter table "payments" add constraint "payments_source_check" check ("source" in ('MANUAL', 'AUTO_PURCHASE'));`,
    );
    this.addSql(
      `alter table "payments" add constraint "payments_amount_check" check ("amount" >= 0);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "payments" cascade;`);
    this.addSql(`drop table if exists "receipts" cascade;`);
  }
}
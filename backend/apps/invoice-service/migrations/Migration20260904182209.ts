import { Migration } from '@mikro-orm/migrations';

export class Migration20260904182209 extends Migration {
  override name = 'Migration20260904182209';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "invoices" ("id" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "order_id" varchar(255) not null, "customer_id" varchar(255) not null, "total_amount" numeric(12,2) not null default 0, "paid_amount" numeric(12,2) not null default 0, "status" text not null default 'UNPAID', "note" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "invoices" add constraint "invoices_code_unique" unique ("code");`,
    );
    this.addSql(
      `alter table "invoices" add constraint "invoices_order_id_unique" unique ("order_id");`,
    );

    this.addSql(
      `alter table "invoices" add constraint "invoices_status_check" check ("status" in ('UNPAID', 'PARTIAL', 'PAID'));`,
    );
    this.addSql(
      `alter table "invoices" add constraint "invoices_total_amount_check" check ("total_amount" >= 0);`,
    );
    this.addSql(
      `alter table "invoices" add constraint "invoices_paid_amount_check" check ("paid_amount" >= 0);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "invoices" drop constraint "invoices_total_amount_check";`,
    );
    this.addSql(
      `alter table "invoices" drop constraint "invoices_paid_amount_check";`,
    );
    this.addSql(`drop table if exists "invoices" cascade;`);
  }
}

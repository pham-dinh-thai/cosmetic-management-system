import { Migration } from '@mikro-orm/migrations';

export class Migration20260904182207 extends Migration {
  override name = 'Migration20260904182207';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "orders" ("id" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "customer_id" varchar(255) not null, "status" text not null default 'PENDING', "total_amount" numeric(12,2) not null default 0, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "orders" add constraint "orders_code_unique" unique ("code");`,
    );

    this.addSql(
      `create table "order_lines" ("id" uuid not null default gen_random_uuid(), "order_id" uuid not null, "variant_id" varchar(255) not null, "quantity" int not null default 1, "unit_price" numeric(12,2) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "order_transactions" ("id" uuid not null default gen_random_uuid(), "order_id" uuid not null, "variant_id" varchar(255) not null, "quantity" int not null default 1, "unit_price" numeric(12,2) not null, "subtotal" numeric(12,2) not null default 0, "employee_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "orders" add constraint "orders_status_check" check ("status" in ('PENDING', 'COMPLETED', 'CANCELLED'));`,
    );
    this.addSql(
      `alter table "order_lines" add constraint "order_lines_quantity_check" check ("quantity" > 0);`,
    );
    this.addSql(
      `alter table "order_lines" add constraint "order_lines_unit_price_check" check ("unit_price" >= 0);`,
    );
    this.addSql(
      `alter table "order_transactions" add constraint "order_transactions_quantity_check" check ("quantity" > 0);`,
    );
    this.addSql(
      `alter table "order_transactions" add constraint "order_transactions_unit_price_check" check ("unit_price" >= 0);`,
    );
    this.addSql(
      `alter table "order_transactions" add constraint "order_transactions_subtotal_check" check ("subtotal" >= 0);`,
    );

    this.addSql(
      `alter table "order_lines" add constraint "order_lines_order_id_foreign" foreign key ("order_id") references "orders" ("id") on delete cascade;`,
    );

    this.addSql(
      `alter table "order_transactions" add constraint "order_transactions_order_id_foreign" foreign key ("order_id") references "orders" ("id") on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "order_lines" drop constraint "order_lines_quantity_check";`,
    );
    this.addSql(
      `alter table "order_lines" drop constraint "order_lines_unit_price_check";`,
    );
    this.addSql(
      `alter table "order_transactions" drop constraint "order_transactions_quantity_check";`,
    );
    this.addSql(
      `alter table "order_transactions" drop constraint "order_transactions_unit_price_check";`,
    );
    this.addSql(
      `alter table "order_transactions" drop constraint "order_transactions_subtotal_check";`,
    );
    this.addSql(
      `alter table "order_lines" drop constraint "order_lines_order_id_foreign";`,
    );
    this.addSql(
      `alter table "order_transactions" drop constraint "order_transactions_order_id_foreign";`,
    );

    this.addSql(`drop table if exists "orders" cascade;`);
    this.addSql(`drop table if exists "order_lines" cascade;`);
    this.addSql(`drop table if exists "order_transactions" cascade;`);
  }
}

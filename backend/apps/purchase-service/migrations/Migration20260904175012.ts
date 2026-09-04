import { Migration } from '@mikro-orm/migrations';

export class Migration20260904175012 extends Migration {

  override name = 'Migration20260904175012';

  override up(): void | Promise<void> {
    this.addSql(`create table "purchase_orders" ("id" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "supplier_id" varchar(255) not null, "status" text not null default 'PENDING', "total_amount" numeric(12,2) not null default 0, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "purchase_orders" add constraint "purchase_orders_code_unique" unique ("code");`);

    this.addSql(`create table "purchase_order_lines" ("id" uuid not null default gen_random_uuid(), "purchase_order_id" uuid not null, "variant_id" varchar(255) not null, "quantity" int not null default 1, "unit_price" numeric(12,2) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`alter table "purchase_orders" add constraint "purchase_orders_status_check" check ("status" in ('PENDING', 'COMPLETED', 'CANCELLED'));`);

    this.addSql(`alter table "purchase_order_lines" add constraint "purchase_order_lines_purchase_order_id_foreign" foreign key ("purchase_order_id") references "purchase_orders" ("id") on delete cascade;`);

    this.addSql(`alter table "purchase_order_lines" add constraint "purchase_order_lines_quantity_check" check ("quantity" > 0);`);
    this.addSql(`alter table "purchase_order_lines" add constraint "purchase_order_lines_unit_price_check" check ("unit_price" >= 0);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "purchase_order_lines" drop constraint "purchase_order_lines_quantity_check";`);
    this.addSql(`alter table "purchase_order_lines" drop constraint "purchase_order_lines_unit_price_check";`);
    this.addSql(`alter table "purchase_order_lines" drop constraint "purchase_order_lines_purchase_order_id_foreign";`);

    this.addSql(`drop table if exists "purchase_orders" cascade;`);
    this.addSql(`drop table if exists "purchase_order_lines" cascade;`);
  }

}

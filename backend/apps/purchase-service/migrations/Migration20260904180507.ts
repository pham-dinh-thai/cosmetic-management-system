import { Migration } from '@mikro-orm/migrations';

export class Migration20260904180507 extends Migration {
  override name = 'Migration20260904180507';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "purchase_transactions" ("id" uuid not null default gen_random_uuid(), "purchase_order_id" uuid not null, "variant_id" varchar(255) not null, "quantity" int not null default 1, "unit_price" numeric(12,2) not null, "subtotal" numeric(12,2) not null default 0, "employee_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "purchase_transactions" add constraint "purchase_transactions_purchase_order_id_foreign" foreign key ("purchase_order_id") references "purchase_orders" ("id") on delete cascade;`,
    );

    this.addSql(
      `alter table "purchase_transactions" add constraint "purchase_transactions_quantity_check" check ("quantity" > 0);`,
    );
    this.addSql(
      `alter table "purchase_transactions" add constraint "purchase_transactions_unit_price_check" check ("unit_price" >= 0);`,
    );
    this.addSql(
      `alter table "purchase_transactions" add constraint "purchase_transactions_subtotal_check" check ("subtotal" >= 0);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "purchase_transactions" drop constraint "purchase_transactions_subtotal_check";`,
    );
    this.addSql(
      `alter table "purchase_transactions" drop constraint "purchase_transactions_unit_price_check";`,
    );
    this.addSql(
      `alter table "purchase_transactions" drop constraint "purchase_transactions_quantity_check";`,
    );
    this.addSql(`drop table if exists "purchase_transactions" cascade;`);
  }
}

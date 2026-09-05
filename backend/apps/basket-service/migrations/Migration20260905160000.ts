import { Migration } from '@mikro-orm/migrations';

export class Migration20260905160000 extends Migration {
  override name = 'Migration20260905160000';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "carts" ("id" uuid not null default gen_random_uuid(), "customer_id" varchar(255) not null, "status" varchar(255) not null default 'OPEN', "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "carts" add constraint "carts_customer_id_unique" unique ("customer_id");`,
    );
    this.addSql(
      `alter table "carts" add constraint "carts_status_check" check ("status" in ('OPEN', 'CHECKED_OUT'));`,
    );
    this.addSql(
      `create table "cart_items" ("id" uuid not null default gen_random_uuid(), "cart_id" uuid not null, "variant_id" varchar(255) not null, "quantity" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "cart_items" add constraint "cart_items_cart_id_foreign" foreign key ("cart_id") references "carts" ("id") on delete cascade;`,
    );
    this.addSql(
      `alter table "cart_items" add constraint "cart_items_cart_id_variant_id_unique" unique ("cart_id", "variant_id");`,
    );
    this.addSql(
      `alter table "cart_items" add constraint "cart_items_quantity_check" check ("quantity" > 0);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "cart_items" cascade;`);
    this.addSql(`drop table if exists "carts" cascade;`);
  }
}
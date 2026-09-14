import { Migration } from '@mikro-orm/migrations';

export class Migration20260914100000 extends Migration {
  override name = 'Migration20260914100000';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "batches" ("id" uuid not null default gen_random_uuid(), "inventory_id" uuid not null, "lot_number" varchar(255) not null, "supplier_id" varchar(255) not null, "quantity" int not null default 0, "expiry_date" date null, "is_active" boolean not null default true, "created_by" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "batches" add constraint "batches_inventory_id_foreign" foreign key ("inventory_id") references "inventories" ("id") on delete cascade;`,
    );
    this.addSql(
      `create index "batches_inventory_expiry_date_index" on "batches" ("inventory_id", "expiry_date");`,
    );
    this.addSql(
      `alter table "batches" add constraint "batches_inventory_lot_number_unique" unique ("inventory_id", "lot_number");`,
    );

    this.addSql(`drop table if exists "stock_adjustments" cascade;`);
    this.addSql(
      `create table "stock_adjustments" ("id" uuid not null default gen_random_uuid(), "batch_id" uuid not null, "variant_id" varchar(255) not null, "adjustment" int not null, "reason" varchar(255) not null, "note" varchar(255) null, "created_by" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "stock_adjustments" add constraint "stock_adjustments_batch_id_foreign" foreign key ("batch_id") references "batches" ("id") on delete cascade;`,
    );
    this.addSql(
      `alter table "stock_adjustments" add constraint "stock_adjustments_reason_check" check ("reason" in ('DAMAGED', 'DEFECTIVE', 'EXPIRED', 'OVERSTOCK', 'OTHER'));`,
    );
    this.addSql(
      `alter table "stock_adjustments" add constraint "stock_adjustments_adjustment_check" check ("adjustment" <> 0);`,
    );
    this.addSql(
      `create index "stock_adjustments_batch_id_index" on "stock_adjustments" ("batch_id");`,
    );

    this.addSql(`alter table "inventories" drop column "expiry_date";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "stock_adjustments" cascade;`);
    this.addSql(`drop table if exists "batches" cascade;`);
  }
}
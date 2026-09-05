import { Migration } from '@mikro-orm/migrations';

export class Migration20260905120000 extends Migration {
  override name = 'Migration20260905120000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "inventories" add column "expiry_date" date null;`,
    );
    this.addSql(
      `create table "stock_adjustments" ("id" uuid not null default gen_random_uuid(), "inventory_id" uuid not null, "variant_id" varchar(255) not null, "adjustment" int not null, "reason" varchar(255) not null, "note" varchar(255) null, "created_by" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "stock_adjustments" add constraint "stock_adjustments_inventory_id_foreign" foreign key ("inventory_id") references "inventories" ("id") on delete cascade;`,
    );
    this.addSql(
      `alter table "stock_adjustments" add constraint "stock_adjustments_reason_check" check ("reason" in ('DAMAGED', 'DEFECTIVE', 'EXPIRED', 'OVERSTOCK', 'OTHER'));`,
    );
    this.addSql(
      `alter table "stock_adjustments" add constraint "stock_adjustments_adjustment_check" check ("adjustment" <> 0);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "stock_adjustments" cascade;`);
    this.addSql(`alter table "inventories" drop column "expiry_date";`);
  }
}

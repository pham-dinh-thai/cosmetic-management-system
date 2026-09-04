import { Migration } from '@mikro-orm/migrations';

export class Migration20260904173013 extends Migration {
  override name = 'Migration20260904173013';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "inventories" ("id" uuid not null default gen_random_uuid(), "variant_id" varchar(255) not null, "quantity" int not null default 0, "last_updated_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "inventories" add constraint "inventories_variant_id_unique" unique ("variant_id");`,
    );

    this.addSql(
      `alter table "inventories" add constraint "inventories_quantity_check" check ("quantity" >= 0);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "inventories" drop constraint "inventories_quantity_check";`,
    );
    this.addSql(`drop table if exists "inventories" cascade;`);
  }
}

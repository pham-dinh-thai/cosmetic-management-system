import { Migration } from '@mikro-orm/migrations';

export class Migration20260904171656 extends Migration {
  override name = 'Migration20260904171656';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "cosmetics" ("id" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "name" varchar(255) not null, "brand" varchar(255) null, "origin" varchar(255) null, "description" varchar(1000) null, "image_url" varchar(500) null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "cosmetics" add constraint "cosmetics_code_unique" unique ("code");`,
    );

    this.addSql(
      `create table "cosmetic_categories" ("id" uuid not null default gen_random_uuid(), "cosmetic_id" uuid not null, "category_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "cosmetic_variants" ("id" uuid not null default gen_random_uuid(), "cosmetic_id" uuid not null, "name" varchar(255) not null, "color" varchar(255) null, "volume" varchar(255) null, "price" numeric(12,2) not null, "cost_price" numeric(12,2) null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "cosmetic_categories" add constraint "cosmetic_categories_cosmetic_id_foreign" foreign key ("cosmetic_id") references "cosmetics" ("id") on delete cascade;`,
    );

    this.addSql(
      `alter table "cosmetic_variants" add constraint "cosmetic_variants_cosmetic_id_foreign" foreign key ("cosmetic_id") references "cosmetics" ("id") on delete cascade;`,
    );

    this.addSql(
      `alter table "cosmetic_variants" add constraint "cosmetic_variants_price_check" check ("price" >= 0);`,
    );
    this.addSql(
      `alter table "cosmetic_variants" add constraint "cosmetic_variants_cost_price_check" check ("cost_price" >= 0);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "cosmetic_variants" drop constraint "cosmetic_variants_cost_price_check";`,
    );
    this.addSql(
      `alter table "cosmetic_variants" drop constraint "cosmetic_variants_price_check";`,
    );
    this.addSql(
      `alter table "cosmetic_categories" drop constraint "cosmetic_categories_cosmetic_id_foreign";`,
    );
    this.addSql(
      `alter table "cosmetic_variants" drop constraint "cosmetic_variants_cosmetic_id_foreign";`,
    );

    this.addSql(`drop table if exists "cosmetics" cascade;`);
    this.addSql(`drop table if exists "cosmetic_categories" cascade;`);
    this.addSql(`drop table if exists "cosmetic_variants" cascade;`);
  }
}

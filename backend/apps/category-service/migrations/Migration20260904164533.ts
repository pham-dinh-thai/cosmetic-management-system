import { Migration } from '@mikro-orm/migrations';

export class Migration20260904164533 extends Migration {

  override name = 'Migration20260904164533';

  override up(): void | Promise<void> {
    this.addSql(`create table "categories" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "description" varchar(255) null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "categories" add constraint "categories_name_unique" unique ("name");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "categories" cascade;`);
  }

}

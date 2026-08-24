import { Migration } from '@mikro-orm/migrations';

export class Migration20260824150322 extends Migration {

  override name = 'Migration20260824150322';

  override up(): void | Promise<void> {
    this.addSql(`create table "departments" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "description" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "departments" add constraint "departments_name_unique" unique ("name");`);
  }

}

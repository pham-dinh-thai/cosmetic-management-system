import { Migration } from '@mikro-orm/migrations';

export class Migration20260825095909 extends Migration {

  override name = 'Migration20260825095909';

  override up(): void | Promise<void> {
    this.addSql(`create table "employees" ("id" uuid not null default gen_random_uuid(), "user_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "employees" add constraint "employees_user_id_unique" unique ("user_id");`);
  }

}

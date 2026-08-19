import { Migration } from '@mikro-orm/migrations';

export class Migration20260819093223_create_auth_users_table extends Migration {

  override name = 'Migration20260819093223_create_auth_users_table';

  override up(): void | Promise<void> {
    this.addSql(`create table "auth_users" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "password" varchar(255) not null, "email_verified_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "auth_users" add constraint "auth_users_user_id_unique" unique ("user_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "auth_users" cascade;`);
  }

}

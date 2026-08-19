import { Migration } from '@mikro-orm/migrations';

export class Migration20260819091546_create_users_table extends Migration {

  override name = 'Migration20260819091546_create_users_table';

  override up(): void | Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null default gen_random_uuid(), "first_name" varchar(255) not null, "last_name" varchar(255) not null, "gender" text not null, "phone" varchar(255) not null, "email" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`alter table "users" add constraint "users_gender_check" check ("gender" in ('male', 'female', 'other'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}

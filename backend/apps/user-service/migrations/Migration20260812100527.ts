import { Migration } from '@mikro-orm/migrations';

export class Migration20260812100527 extends Migration {
  override name = 'Migration20260812100527';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "user" ("id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, "name" varchar(255) not null, "password_hash" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
  }
}

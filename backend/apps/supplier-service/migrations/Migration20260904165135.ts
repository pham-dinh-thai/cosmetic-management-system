import { Migration } from '@mikro-orm/migrations';

export class Migration20260904165135 extends Migration {

  override name = 'Migration20260904165135';

  override up(): void | Promise<void> {
    this.addSql(`create table "suppliers" ("id" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) null, "address" varchar(255) null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "suppliers" add constraint "suppliers_code_unique" unique ("code");`);
    this.addSql(`alter table "suppliers" add constraint "suppliers_email_unique" unique ("email");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "suppliers" cascade;`);
  }

}

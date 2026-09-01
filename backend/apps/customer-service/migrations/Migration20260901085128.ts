import { Migration } from '@mikro-orm/migrations';

export class Migration20260901085128 extends Migration {

  override name = 'Migration20260901085128';

  override up(): void | Promise<void> {
    this.addSql(`create table "customers" ("id" uuid not null default gen_random_uuid(), "user_id" varchar(255) not null, "code" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "customers" add constraint "customers_user_id_unique" unique ("user_id");`);
    this.addSql(`alter table "customers" add constraint "customers_code_unique" unique ("code");`);

    this.addSql(`create table "addresses" ("id" uuid not null default gen_random_uuid(), "customer_id" uuid not null, "city" varchar(255) not null, "street" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`create table "phones" ("id" uuid not null default gen_random_uuid(), "customer_id" uuid not null, "phone" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "phones" add constraint "phones_phone_unique" unique ("phone");`);

    this.addSql(`alter table "addresses" add constraint "addresses_customer_id_foreign" foreign key ("customer_id") references "customers" ("id") on delete cascade;`);

    this.addSql(`alter table "phones" add constraint "phones_customer_id_foreign" foreign key ("customer_id") references "customers" ("id") on delete cascade;`);
  }

}

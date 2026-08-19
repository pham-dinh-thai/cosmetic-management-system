import { Migration } from '@mikro-orm/migrations';

export class Migration20260819090824_rename_columns_add_new_fields extends Migration {
  override name = 'Migration20260819090824_rename_columns_add_new_fields';

  override up(): void | Promise<void> {
    this.addSql(`TRUNCATE TABLE users CASCADE;`);
    this.addSql(
      `alter table "users" drop column "name", drop column "password";`,
    );
    this.addSql(
      `alter table "users" add "first_name" varchar(255) not null, add "last_name" varchar(255) not null, add "gender" text not null, add "phone" varchar(255) not null;`,
    );
    this.addSql(`alter table "users" drop constraint "user_email_unique";`);
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );
    this.addSql(
      `alter table "users" add constraint "users_gender_check" check ("gender" in ('male', 'female', 'other'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_gender_check";`);
    this.addSql(
      `alter table "users" drop column "first_name", drop column "last_name", drop column "gender", drop column "phone";`,
    );
    this.addSql(
      `alter table "users" add "name" varchar(255) not null, add "password" varchar(255) not null;`,
    );
    this.addSql(`alter table "users" drop constraint "users_email_unique";`);
    this.addSql(
      `alter table "users" add constraint "user_email_unique" unique ("email");`,
    );
  }
}

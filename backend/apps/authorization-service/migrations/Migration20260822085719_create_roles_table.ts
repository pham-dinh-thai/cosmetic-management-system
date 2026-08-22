import { Migration } from '@mikro-orm/migrations';

export class Migration20260822085719_create_roles_table extends Migration {

  override name = 'Migration20260822085719_create_roles_table';

  override up(): void | Promise<void> {
    this.addSql(`create table "roles" ("id" varchar(255) not null, "name" varchar(255) not null, primary key ("id"));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "roles" cascade;`);
  }

}

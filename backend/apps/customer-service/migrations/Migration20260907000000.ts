import { Migration } from '@mikro-orm/migrations';

export class Migration20260907000000 extends Migration {
  override name = 'Migration20260907000000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "customers" add column if not exists "name" varchar(255) not null default '';`,
    );
    this.addSql(
      `alter table "customers" add column if not exists "email" varchar(255) not null default '';`,
    );
    this.addSql(
      `alter table "customers" add column if not exists "phone" varchar(255) not null default '';`,
    );
    this.addSql(
      `alter table "customers" add column if not exists "address" varchar(255) not null default '';`,
    );
  }
}

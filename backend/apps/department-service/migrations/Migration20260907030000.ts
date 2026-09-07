import { Migration } from '@mikro-orm/migrations';

export class Migration20260907030000 extends Migration {
  override name = 'Migration20260907030000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "departments" add column if not exists "positions" text[] not null default '{}';`,
    );
  }
}
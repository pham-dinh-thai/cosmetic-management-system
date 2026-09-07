import { Migration } from '@mikro-orm/migrations';

export class Migration20260907120000 extends Migration {
  override name = 'Migration20260907120000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "departments" drop column if exists "positions";`,
    );
  }
}
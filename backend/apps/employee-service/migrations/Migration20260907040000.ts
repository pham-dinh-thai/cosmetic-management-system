import { Migration } from '@mikro-orm/migrations';

export class Migration20260907040000 extends Migration {
  override name = 'Migration20260907040000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "employees" drop constraint if exists "employees_position_check";`,
    );
  }
}
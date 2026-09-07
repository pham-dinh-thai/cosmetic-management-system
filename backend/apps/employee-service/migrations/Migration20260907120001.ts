import { Migration } from '@mikro-orm/migrations';

export class Migration20260907120001 extends Migration {
  override name = 'Migration20260907120001';

  override up(): void | Promise<void> {
    this.addSql(
      `update "employees" set "position" = 'staff' where "position" not in ('staff', 'manager');`,
    );
    this.addSql(
      `alter table "employees" add constraint "employees_position_check" check ("position" in ('staff', 'manager'));`,
    );
  }
}
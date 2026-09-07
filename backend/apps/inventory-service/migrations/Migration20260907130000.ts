import { Migration } from '@mikro-orm/migrations';

export class Migration20260907130000 extends Migration {
  override name = 'Migration20260907130000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "inventories" add column "min_stock" int not null default 0;`,
    );
    this.addSql(
      `alter table "inventories" add constraint "inventories_min_stock_check" check ("min_stock" >= 0);`,
    );
  }
}
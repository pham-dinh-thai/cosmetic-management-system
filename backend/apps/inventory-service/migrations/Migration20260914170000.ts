import { Migration } from '@mikro-orm/migrations';

export class Migration20260914170000 extends Migration {
  override name = 'Migration20260914170000';

  override up(): void | Promise<void> {
    this.addSql(`alter table "inventories" drop column "quantity";`);
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "inventories" add column "quantity" int not null default 0;`,
    );
    this.addSql(
      `alter table "inventories" add constraint "inventories_quantity_check" check ("quantity" >= 0);`,
    );
  }
}
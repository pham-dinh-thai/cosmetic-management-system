import { Migration } from '@mikro-orm/migrations';

export class Migration20260909000001 extends Migration {
  override name = 'Migration20260909000001';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "inventories" add column "created_by" uuid null;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "inventories" drop column "created_by";`);
  }
}
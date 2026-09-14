import { Migration } from '@mikro-orm/migrations';

export class Migration20260914160000 extends Migration {
  override name = 'Migration20260914160000';

  override up(): void | Promise<void> {
    this.addSql(`alter table "inventories" drop column "last_updated_at";`);
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "inventories" add column "last_updated_at" timestamptz not null;`,
    );
  }
}
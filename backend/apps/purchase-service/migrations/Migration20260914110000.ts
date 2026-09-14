import { Migration } from '@mikro-orm/migrations';

export class Migration20260914110000 extends Migration {
  override name = 'Migration20260914110000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "purchase_order_lines" add column "expiry_date" date null;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "purchase_order_lines" drop column "expiry_date";`);
  }
}
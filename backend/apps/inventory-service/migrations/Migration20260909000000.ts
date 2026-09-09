import { Migration } from '@mikro-orm/migrations';

export class Migration20260909000000 extends Migration {
  override name = 'Migration20260909000000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "inventories" add column "is_active" boolean not null default true;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "inventories" drop column "is_active";`);
  }
}
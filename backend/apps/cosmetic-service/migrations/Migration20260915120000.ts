import { Migration } from '@mikro-orm/migrations';

export class Migration20260915120000 extends Migration {
  override name = 'Migration20260915120000';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "cosmetic_variants" alter column "cost_price" set not null;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "cosmetic_variants" alter column "cost_price" drop not null;`,
    );
  }
}

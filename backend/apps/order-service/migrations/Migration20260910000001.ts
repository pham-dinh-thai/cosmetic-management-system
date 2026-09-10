import { Migration } from '@mikro-orm/migrations';

export class Migration20260910000001 extends Migration {
  override name = 'Migration20260910000001';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "orders" add column "payment_method" varchar(255) not null default 'CASH';`,
    );
    this.addSql(
      `alter table "orders" add constraint "orders_payment_method_check" check ("payment_method" in ('CASH', 'BANK_TRANSFER', 'CARD'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "orders" drop constraint "orders_payment_method_check";`,
    );
    this.addSql(`alter table "orders" drop column "payment_method";`);
  }
}
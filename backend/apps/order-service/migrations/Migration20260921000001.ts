import { Migration } from '@mikro-orm/migrations';

export class Migration20260921000001 extends Migration {
  override name = 'Migration20260921000001';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "orders" add column "recipient_name" varchar(255) null;`,
    );
    this.addSql(
      `alter table "orders" add column "recipient_phone" varchar(255) null;`,
    );
    this.addSql(
      `alter table "orders" add column "shipping_address" varchar(255) null;`,
    );
    this.addSql(
      `alter table "orders" add column "shipping_city" varchar(255) null;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "orders" drop column "recipient_name";`);
    this.addSql(`alter table "orders" drop column "recipient_phone";`);
    this.addSql(`alter table "orders" drop column "shipping_address";`);
    this.addSql(`alter table "orders" drop column "shipping_city";`);
  }
}
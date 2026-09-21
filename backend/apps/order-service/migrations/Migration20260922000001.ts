import { Migration } from '@mikro-orm/migrations';

export class Migration20260922000001 extends Migration {
  override name = 'Migration20260922000001';

  override up(): void | Promise<void> {
    this.addSql(`alter table "orders" drop constraint "orders_status_check";`);

    this.addSql(
      `alter table "orders" add column "payment_status" varchar(255) not null default 'UNPAID';`,
    );

    this.addSql(
      `update "orders" set "payment_status" = 'PAID' where "status" = 'COMPLETED';`,
    );

    this.addSql(
      `update "orders" set "status" = 'DELIVERED' where "status" = 'COMPLETED';`,
    );

    this.addSql(
      `update "orders" set "status" = 'PENDING_CONFIRMATION' where "status" = 'PENDING';`,
    );

    this.addSql(
      `alter table "orders" alter column "status" set default 'PENDING_CONFIRMATION';`,
    );

    this.addSql(
      `alter table "orders" add constraint "orders_status_check" check ("status" in ('PENDING_CONFIRMATION', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'DELIVERY_FAILED', 'RETURNED', 'REFUNDED'));`,
    );

    this.addSql(
      `alter table "orders" add constraint "orders_payment_status_check" check ("payment_status" in ('UNPAID', 'PAID'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "orders" drop constraint "orders_payment_status_check";`,
    );

    this.addSql(`alter table "orders" drop constraint "orders_status_check";`);

    this.addSql(
      `update "orders" set "status" = 'PENDING' where "status" = 'PENDING_CONFIRMATION';`,
    );
    this.addSql(
      `update "orders" set "status" = 'COMPLETED' where "status" = 'DELIVERED';`,
    );
    this.addSql(
      `update "orders" set "status" = 'CANCELLED' where "status" not in ('PENDING', 'COMPLETED', 'CANCELLED');`,
    );

    this.addSql(
      `alter table "orders" alter column "status" set default 'PENDING';`,
    );

    this.addSql(
      `alter table "orders" add constraint "orders_status_check" check ("status" in ('PENDING', 'COMPLETED', 'CANCELLED'));`,
    );

    this.addSql(`alter table "orders" drop column "payment_status";`);
  }
}

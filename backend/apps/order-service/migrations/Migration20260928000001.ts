import { Migration } from '@mikro-orm/migrations';

export class Migration20260928000001 extends Migration {
  override name = 'Migration20260928000001';

  override up(): void | Promise<void> {
    this.addSql(`alter table "orders" drop constraint "orders_status_check";`);
    this.addSql(
      `alter table "orders" drop constraint "orders_payment_status_check";`,
    );
    this.addSql(
      `alter table "orders" drop constraint "orders_payment_method_check";`,
    );

    this.addSql(
      `update "orders" set "status" = case "status" when 'PENDING' then 'pending' when 'PENDING_CONFIRMATION' then 'pending' when 'CONFIRMED' then 'confirmed' when 'PREPARING' then 'preparing' when 'SHIPPING' then 'shipping' when 'DELIVERED' then 'delivered' when 'COMPLETED' then 'completed' when 'CANCELLED' then 'cancelled' when 'DELIVERY_FAILED' then 'delivery_failed' when 'RETURNED' then 'returned' when 'REFUNDED' then 'refunded' else "status" end;`,
    );
    this.addSql(
      `update "orders" set "payment_status" = case "payment_status" when 'UNPAID' then 'unpaid' when 'PAID' then 'paid' else "payment_status" end;`,
    );
    this.addSql(
      `update "orders" set "payment_method" = case "payment_method" when 'CASH' then 'cash' when 'BANK_TRANSFER' then 'bank_transfer' when 'CARD' then 'card' else "payment_method" end;`,
    );

    this.addSql(
      `alter table "orders" alter column "status" set default 'pending';`,
    );
    this.addSql(
      `alter table "orders" alter column "payment_status" set default 'unpaid';`,
    );
    this.addSql(
      `alter table "orders" alter column "payment_method" set default 'cash';`,
    );

    this.addSql(
      `alter table "orders" add constraint "orders_status_check" check ("status" in ('pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'completed', 'cancelled', 'delivery_failed', 'returned', 'refunded'));`,
    );
    this.addSql(
      `alter table "orders" add constraint "orders_payment_status_check" check ("payment_status" in ('unpaid', 'paid'));`,
    );
    this.addSql(
      `alter table "orders" add constraint "orders_payment_method_check" check ("payment_method" in ('cash', 'bank_transfer', 'card'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "orders" drop constraint "orders_payment_method_check";`,
    );
    this.addSql(
      `alter table "orders" drop constraint "orders_payment_status_check";`,
    );
    this.addSql(`alter table "orders" drop constraint "orders_status_check";`);

    this.addSql(
      `update "orders" set "status" = case "status" when 'pending' then 'PENDING_CONFIRMATION' when 'confirmed' then 'CONFIRMED' when 'preparing' then 'PREPARING' when 'shipping' then 'SHIPPING' when 'delivered' then 'DELIVERED' when 'completed' then 'DELIVERED' when 'cancelled' then 'CANCELLED' when 'delivery_failed' then 'DELIVERY_FAILED' when 'returned' then 'RETURNED' when 'refunded' then 'REFUNDED' else "status" end;`,
    );
    this.addSql(
      `update "orders" set "payment_status" = case "payment_status" when 'unpaid' then 'UNPAID' when 'paid' then 'PAID' else "payment_status" end;`,
    );
    this.addSql(
      `update "orders" set "payment_method" = case "payment_method" when 'cash' then 'CASH' when 'bank_transfer' then 'BANK_TRANSFER' when 'card' then 'CARD' else "payment_method" end;`,
    );

    this.addSql(
      `alter table "orders" alter column "status" set default 'PENDING_CONFIRMATION';`,
    );
    this.addSql(
      `alter table "orders" alter column "payment_status" set default 'UNPAID';`,
    );
    this.addSql(
      `alter table "orders" alter column "payment_method" set default 'CASH';`,
    );

    this.addSql(
      `alter table "orders" add constraint "orders_status_check" check ("status" in ('PENDING_CONFIRMATION', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'DELIVERY_FAILED', 'RETURNED', 'REFUNDED'));`,
    );
    this.addSql(
      `alter table "orders" add constraint "orders_payment_status_check" check ("payment_status" in ('UNPAID', 'PAID'));`,
    );
    this.addSql(
      `alter table "orders" add constraint "orders_payment_method_check" check ("payment_method" in ('CASH', 'BANK_TRANSFER', 'CARD'));`,
    );
  }
}

import { Migration } from '@mikro-orm/migrations';

export class Migration20260909072650 extends Migration {

  override name = 'Migration20260909072650';

  override up(): void | Promise<void> {
    this.addSql(`alter table "purchase_orders" add "employee_id" varchar(255) null;`);

    this.addSql(`alter table "purchase_order_lines" drop constraint "purchase_order_lines_quantity_check";`);
    this.addSql(`alter table "purchase_order_lines" drop constraint "purchase_order_lines_unit_price_check";`);

    this.addSql(`alter table "purchase_transactions" drop constraint "purchase_transactions_quantity_check";`);
    this.addSql(`alter table "purchase_transactions" drop constraint "purchase_transactions_subtotal_check";`);
    this.addSql(`alter table "purchase_transactions" drop constraint "purchase_transactions_unit_price_check";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "purchase_order_lines" add constraint "purchase_order_lines_quantity_check" check (quantity > 0);`);
    this.addSql(`alter table "purchase_order_lines" add constraint "purchase_order_lines_unit_price_check" check (unit_price >= 0);`);

    this.addSql(`alter table "purchase_orders" drop column "employee_id";`);

    this.addSql(`alter table "purchase_transactions" add constraint "purchase_transactions_quantity_check" check (quantity > 0);`);
    this.addSql(`alter table "purchase_transactions" add constraint "purchase_transactions_subtotal_check" check (subtotal >= 0);`);
    this.addSql(`alter table "purchase_transactions" add constraint "purchase_transactions_unit_price_check" check (unit_price >= 0);`);
  }

}

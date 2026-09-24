import { Migration } from '@mikro-orm/migrations';

export class Migration20260925100000_seed_all_business_permissions extends Migration {
  override name = 'Migration20260925100000_seed_all_business_permissions';

  override up(): void | Promise<void> {
    this.addSql(`insert into "permissions" ("id", "resource", "action", "is_active", "created_at", "updated_at") values
      ('departments:read', 'departments', 'read', true, now(), now()),
      ('departments:write', 'departments', 'write', true, now(), now()),
      ('departments:delete', 'departments', 'delete', true, now(), now()),
      ('categories:read', 'categories', 'read', true, now(), now()),
      ('categories:write', 'categories', 'write', true, now(), now()),
      ('categories:delete', 'categories', 'delete', true, now(), now()),
      ('suppliers:read', 'suppliers', 'read', true, now(), now()),
      ('suppliers:write', 'suppliers', 'write', true, now(), now()),
      ('suppliers:delete', 'suppliers', 'delete', true, now(), now()),
      ('cosmetics:read', 'cosmetics', 'read', true, now(), now()),
      ('cosmetics:write', 'cosmetics', 'write', true, now(), now()),
      ('cosmetics:delete', 'cosmetics', 'delete', true, now(), now()),
      ('cosmetic_variants:read', 'cosmetic_variants', 'read', true, now(), now()),
      ('cosmetic_variants:write', 'cosmetic_variants', 'write', true, now(), now()),
      ('cosmetic_variants:delete', 'cosmetic_variants', 'delete', true, now(), now()),
      ('inventory:read', 'inventory', 'read', true, now(), now()),
      ('inventory:write', 'inventory', 'write', true, now(), now()),
      ('inventory:delete', 'inventory', 'delete', true, now(), now()),
      ('orders:read', 'orders', 'read', true, now(), now()),
      ('orders:write', 'orders', 'write', true, now(), now()),
      ('orders:delete', 'orders', 'delete', true, now(), now()),
      ('invoices:read', 'invoices', 'read', true, now(), now()),
      ('invoices:write', 'invoices', 'write', true, now(), now()),
      ('invoices:delete', 'invoices', 'delete', true, now(), now()),
      ('receipts:read', 'receipts', 'read', true, now(), now()),
      ('receipts:write', 'receipts', 'write', true, now(), now()),
      ('receipts:delete', 'receipts', 'delete', true, now(), now()),
      ('payments:read', 'payments', 'read', true, now(), now()),
      ('payments:write', 'payments', 'write', true, now(), now()),
      ('payments:delete', 'payments', 'delete', true, now(), now()),
      ('purchase_orders:read', 'purchase_orders', 'read', true, now(), now()),
      ('purchase_orders:write', 'purchase_orders', 'write', true, now(), now()),
      ('purchase_orders:delete', 'purchase_orders', 'delete', true, now(), now()),
      ('stock_adjustments:read', 'stock_adjustments', 'read', true, now(), now()),
      ('stock_adjustments:write', 'stock_adjustments', 'write', true, now(), now()),
      ('stock_adjustments:delete', 'stock_adjustments', 'delete', true, now(), now())
      on conflict ("id") do nothing;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`delete from "permissions" where "resource" in
      ('departments', 'categories', 'suppliers', 'cosmetics', 'cosmetic_variants', 'inventory',
       'orders', 'invoices', 'receipts', 'payments', 'purchase_orders', 'stock_adjustments');`);
  }
}
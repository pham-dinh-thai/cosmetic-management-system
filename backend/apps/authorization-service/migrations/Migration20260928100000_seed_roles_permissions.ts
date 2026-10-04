import { Migration } from '@mikro-orm/migrations';

// Gan san quyen cho tung role de dang nhap la dung duoc ngay, khong phai vao
// tung man hinh gan tay.
export class Migration20260928100000_seed_roles_permissions extends Migration {
  override name = 'Migration20260928100000_seed_roles_permissions';

  override up(): void | Promise<void> {
    // Admin: 60 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('admin', 'audit_logs:read', now(), now()),
      ('admin', 'auth_users:delete', now(), now()),
      ('admin', 'auth_users:read', now(), now()),
      ('admin', 'auth_users:write', now(), now()),
      ('admin', 'categories:delete', now(), now()),
      ('admin', 'categories:read', now(), now()),
      ('admin', 'categories:write', now(), now()),
      ('admin', 'cosmetic_variants:delete', now(), now()),
      ('admin', 'cosmetic_variants:read', now(), now()),
      ('admin', 'cosmetic_variants:write', now(), now()),
      ('admin', 'cosmetics:delete', now(), now()),
      ('admin', 'cosmetics:read', now(), now()),
      ('admin', 'cosmetics:write', now(), now()),
      ('admin', 'customers:delete', now(), now()),
      ('admin', 'customers:read', now(), now()),
      ('admin', 'customers:write', now(), now()),
      ('admin', 'dashboard:accounting', now(), now()),
      ('admin', 'dashboard:overview', now(), now()),
      ('admin', 'dashboard:sales', now(), now()),
      ('admin', 'dashboard:warehouse', now(), now()),
      ('admin', 'departments:delete', now(), now()),
      ('admin', 'departments:read', now(), now()),
      ('admin', 'departments:write', now(), now()),
      ('admin', 'employees:delete', now(), now()),
      ('admin', 'employees:read', now(), now()),
      ('admin', 'employees:write', now(), now()),
      ('admin', 'inventory:delete', now(), now()),
      ('admin', 'inventory:read', now(), now()),
      ('admin', 'inventory:write', now(), now()),
      ('admin', 'invoices:delete', now(), now()),
      ('admin', 'invoices:read', now(), now()),
      ('admin', 'invoices:write', now(), now()),
      ('admin', 'orders:delete', now(), now()),
      ('admin', 'orders:read', now(), now()),
      ('admin', 'orders:write', now(), now()),
      ('admin', 'payments:delete', now(), now()),
      ('admin', 'payments:read', now(), now()),
      ('admin', 'payments:write', now(), now()),
      ('admin', 'permissions:delete', now(), now()),
      ('admin', 'permissions:read', now(), now()),
      ('admin', 'permissions:write', now(), now()),
      ('admin', 'purchase_orders:delete', now(), now()),
      ('admin', 'purchase_orders:read', now(), now()),
      ('admin', 'purchase_orders:write', now(), now()),
      ('admin', 'receipts:delete', now(), now()),
      ('admin', 'receipts:read', now(), now()),
      ('admin', 'receipts:write', now(), now()),
      ('admin', 'reports:read', now(), now()),
      ('admin', 'roles:delete', now(), now()),
      ('admin', 'roles:read', now(), now()),
      ('admin', 'roles:write', now(), now()),
      ('admin', 'stock_adjustments:delete', now(), now()),
      ('admin', 'stock_adjustments:read', now(), now()),
      ('admin', 'stock_adjustments:write', now(), now()),
      ('admin', 'suppliers:delete', now(), now()),
      ('admin', 'suppliers:read', now(), now()),
      ('admin', 'suppliers:write', now(), now()),
      ('admin', 'users:delete', now(), now()),
      ('admin', 'users:read', now(), now()),
      ('admin', 'users:write', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
    // Customer: 3 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('customer', 'auth_users:delete', now(), now()),
      ('customer', 'auth_users:read', now(), now()),
      ('customer', 'auth_users:write', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
    // Employee: 1 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('employee', 'dashboard:overview', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
    // Warehouse Manager: 21 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('warehouse-manager', 'auth_users:delete', now(), now()),
      ('warehouse-manager', 'auth_users:read', now(), now()),
      ('warehouse-manager', 'auth_users:write', now(), now()),
      ('warehouse-manager', 'cosmetic_variants:delete', now(), now()),
      ('warehouse-manager', 'cosmetic_variants:read', now(), now()),
      ('warehouse-manager', 'cosmetic_variants:write', now(), now()),
      ('warehouse-manager', 'cosmetics:read', now(), now()),
      ('warehouse-manager', 'dashboard:warehouse', now(), now()),
      ('warehouse-manager', 'inventory:delete', now(), now()),
      ('warehouse-manager', 'inventory:read', now(), now()),
      ('warehouse-manager', 'inventory:write', now(), now()),
      ('warehouse-manager', 'purchase_orders:delete', now(), now()),
      ('warehouse-manager', 'purchase_orders:read', now(), now()),
      ('warehouse-manager', 'purchase_orders:write', now(), now()),
      ('warehouse-manager', 'reports:read', now(), now()),
      ('warehouse-manager', 'stock_adjustments:delete', now(), now()),
      ('warehouse-manager', 'stock_adjustments:read', now(), now()),
      ('warehouse-manager', 'stock_adjustments:write', now(), now()),
      ('warehouse-manager', 'suppliers:delete', now(), now()),
      ('warehouse-manager', 'suppliers:read', now(), now()),
      ('warehouse-manager', 'suppliers:write', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
    // Warehouse Employee: 15 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('warehouse-employee', 'auth_users:delete', now(), now()),
      ('warehouse-employee', 'auth_users:read', now(), now()),
      ('warehouse-employee', 'auth_users:write', now(), now()),
      ('warehouse-employee', 'dashboard:warehouse', now(), now()),
      ('warehouse-employee', 'inventory:delete', now(), now()),
      ('warehouse-employee', 'inventory:read', now(), now()),
      ('warehouse-employee', 'inventory:write', now(), now()),
      ('warehouse-employee', 'purchase_orders:delete', now(), now()),
      ('warehouse-employee', 'purchase_orders:read', now(), now()),
      ('warehouse-employee', 'purchase_orders:write', now(), now()),
      ('warehouse-employee', 'reports:read', now(), now()),
      ('warehouse-employee', 'stock_adjustments:delete', now(), now()),
      ('warehouse-employee', 'stock_adjustments:read', now(), now()),
      ('warehouse-employee', 'stock_adjustments:write', now(), now()),
      ('warehouse-employee', 'suppliers:read', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
    // Sales Manager: 21 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('sales-manager', 'auth_users:delete', now(), now()),
      ('sales-manager', 'auth_users:read', now(), now()),
      ('sales-manager', 'auth_users:write', now(), now()),
      ('sales-manager', 'categories:delete', now(), now()),
      ('sales-manager', 'categories:read', now(), now()),
      ('sales-manager', 'categories:write', now(), now()),
      ('sales-manager', 'cosmetic_variants:delete', now(), now()),
      ('sales-manager', 'cosmetic_variants:read', now(), now()),
      ('sales-manager', 'cosmetic_variants:write', now(), now()),
      ('sales-manager', 'cosmetics:delete', now(), now()),
      ('sales-manager', 'cosmetics:read', now(), now()),
      ('sales-manager', 'cosmetics:write', now(), now()),
      ('sales-manager', 'customers:read', now(), now()),
      ('sales-manager', 'dashboard:sales', now(), now()),
      ('sales-manager', 'invoices:delete', now(), now()),
      ('sales-manager', 'invoices:read', now(), now()),
      ('sales-manager', 'invoices:write', now(), now()),
      ('sales-manager', 'orders:delete', now(), now()),
      ('sales-manager', 'orders:read', now(), now()),
      ('sales-manager', 'orders:write', now(), now()),
      ('sales-manager', 'reports:read', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
    // Sales Employee: 19 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('sales-employee', 'auth_users:delete', now(), now()),
      ('sales-employee', 'auth_users:read', now(), now()),
      ('sales-employee', 'auth_users:write', now(), now()),
      ('sales-employee', 'categories:read', now(), now()),
      ('sales-employee', 'cosmetic_variants:delete', now(), now()),
      ('sales-employee', 'cosmetic_variants:read', now(), now()),
      ('sales-employee', 'cosmetic_variants:write', now(), now()),
      ('sales-employee', 'cosmetics:delete', now(), now()),
      ('sales-employee', 'cosmetics:read', now(), now()),
      ('sales-employee', 'cosmetics:write', now(), now()),
      ('sales-employee', 'customers:read', now(), now()),
      ('sales-employee', 'dashboard:sales', now(), now()),
      ('sales-employee', 'invoices:delete', now(), now()),
      ('sales-employee', 'invoices:read', now(), now()),
      ('sales-employee', 'invoices:write', now(), now()),
      ('sales-employee', 'orders:delete', now(), now()),
      ('sales-employee', 'orders:read', now(), now()),
      ('sales-employee', 'orders:write', now(), now()),
      ('sales-employee', 'reports:read', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
    // Accountant Manager: 14 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('accountant-manager', 'auth_users:delete', now(), now()),
      ('accountant-manager', 'auth_users:read', now(), now()),
      ('accountant-manager', 'auth_users:write', now(), now()),
      ('accountant-manager', 'dashboard:accounting', now(), now()),
      ('accountant-manager', 'invoices:delete', now(), now()),
      ('accountant-manager', 'invoices:read', now(), now()),
      ('accountant-manager', 'invoices:write', now(), now()),
      ('accountant-manager', 'payments:delete', now(), now()),
      ('accountant-manager', 'payments:read', now(), now()),
      ('accountant-manager', 'payments:write', now(), now()),
      ('accountant-manager', 'receipts:delete', now(), now()),
      ('accountant-manager', 'receipts:read', now(), now()),
      ('accountant-manager', 'receipts:write', now(), now()),
      ('accountant-manager', 'reports:read', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
    // Accountant Employee: 13 quyen
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('accountant-employee', 'auth_users:delete', now(), now()),
      ('accountant-employee', 'auth_users:read', now(), now()),
      ('accountant-employee', 'auth_users:write', now(), now()),
      ('accountant-employee', 'dashboard:accounting', now(), now()),
      ('accountant-employee', 'invoices:delete', now(), now()),
      ('accountant-employee', 'invoices:read', now(), now()),
      ('accountant-employee', 'invoices:write', now(), now()),
      ('accountant-employee', 'payments:delete', now(), now()),
      ('accountant-employee', 'payments:read', now(), now()),
      ('accountant-employee', 'payments:write', now(), now()),
      ('accountant-employee', 'receipts:delete', now(), now()),
      ('accountant-employee', 'receipts:read', now(), now()),
      ('accountant-employee', 'receipts:write', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`delete from "roles_permissions" where "role_id" in ('admin', 'customer', 'employee', 'warehouse-manager', 'warehouse-employee', 'sales-manager', 'sales-employee', 'accountant-manager', 'accountant-employee');`);
  }
}

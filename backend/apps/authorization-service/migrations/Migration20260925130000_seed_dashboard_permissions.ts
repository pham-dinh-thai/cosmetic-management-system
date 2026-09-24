import { Migration } from '@mikro-orm/migrations';

export class Migration20260925130000_seed_dashboard_permissions extends Migration {
  override name = 'Migration20260925130000_seed_dashboard_permissions';

  override up(): void | Promise<void> {
    // Permission dashboard dùng action là tên dashboard (overview/warehouse/sales/
    // accounting), không thuộc bộ read/write/delete nên bỏ check constraint cũ
    // (tương tự đã làm với permissions_resource_check).
    this.addSql(
      `alter table "permissions" drop constraint if exists "permissions_action_check";`,
    );

    this.addSql(`insert into "permissions" ("id", "resource", "action", "is_active", "created_at", "updated_at") values
      ('dashboard:overview', 'dashboard', 'overview', true, now(), now()),
      ('dashboard:warehouse', 'dashboard', 'warehouse', true, now(), now()),
      ('dashboard:sales', 'dashboard', 'sales', true, now(), now()),
      ('dashboard:accounting', 'dashboard', 'accounting', true, now(), now())
      on conflict ("id") do nothing;`);

    // Quyền xem dashboard theo vai trò chuẩn + quyền đọc tối thiểu của
    // từng khu vực để dashboard hiển thị được dữ liệu ngay khi đăng nhập.
    this.addSql(`insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('admin', 'dashboard:overview', now(), now()),
      ('admin', 'dashboard:warehouse', now(), now()),
      ('admin', 'dashboard:sales', now(), now()),
      ('admin', 'dashboard:accounting', now(), now()),
      ('employee', 'dashboard:overview', now(), now()),
      ('warehouse-manager', 'dashboard:warehouse', now(), now()),
      ('warehouse-employee', 'dashboard:warehouse', now(), now()),
      ('warehouse-employee', 'inventory:read', now(), now()),
      ('warehouse-employee', 'purchase_orders:read', now(), now()),
      ('warehouse-employee', 'stock_adjustments:read', now(), now()),
      ('warehouse-employee', 'suppliers:read', now(), now()),
      ('sales-manager', 'dashboard:sales', now(), now()),
      ('sales-manager', 'orders:read', now(), now()),
      ('sales-manager', 'cosmetics:read', now(), now()),
      ('sales-manager', 'categories:read', now(), now()),
      ('sales-employee', 'dashboard:sales', now(), now()),
      ('sales-employee', 'orders:read', now(), now()),
      ('sales-employee', 'cosmetics:read', now(), now()),
      ('sales-employee', 'categories:read', now(), now()),
      ('accountant-manager', 'dashboard:accounting', now(), now()),
      ('accountant-manager', 'invoices:read', now(), now()),
      ('accountant-manager', 'receipts:read', now(), now()),
      ('accountant-manager', 'payments:read', now(), now()),
      ('accountant-employee', 'dashboard:accounting', now(), now()),
      ('accountant-employee', 'invoices:read', now(), now()),
      ('accountant-employee', 'receipts:read', now(), now()),
      ('accountant-employee', 'payments:read', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`delete from "roles_permissions" where "permission_id" like 'dashboard:%';`);
    this.addSql(`delete from "roles_permissions" where "permission_id" in
      ('inventory:read', 'purchase_orders:read', 'stock_adjustments:read', 'suppliers:read',
       'orders:read', 'cosmetics:read', 'categories:read',
       'invoices:read', 'receipts:read', 'payments:read')
      and "role_id" in ('warehouse-employee', 'sales-manager', 'sales-employee',
        'accountant-manager', 'accountant-employee');`);
    this.addSql(`delete from "permissions" where "resource" = 'dashboard';`);
  }
}
import { Migration } from '@mikro-orm/migrations';

// Roles phai ton tai truoc moi migration gan quyen, vi roles_permissions co
// foreign key sang roles.
export class Migration20260924135930_seed_roles extends Migration {
  override name = 'Migration20260924135930_seed_roles';

  override up(): void | Promise<void> {
    this.addSql(`insert into "roles" ("id", "name", "is_active", "created_at", "updated_at") values
      ('admin', 'Admin', true, now(), now()),
      ('customer', 'Customer', true, now(), now()),
      ('employee', 'Employee', true, now(), now()),
      ('warehouse-manager', 'Warehouse Manager', true, now(), now()),
      ('warehouse-employee', 'Warehouse Employee', true, now(), now()),
      ('sales-manager', 'Sales Manager', true, now(), now()),
      ('sales-employee', 'Sales Employee', true, now(), now()),
      ('accountant-manager', 'Accountant Manager', true, now(), now()),
      ('accountant-employee', 'Accountant Employee', true, now(), now())
      on conflict ("id") do nothing;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`delete from "roles" where "id" in ('admin', 'customer', 'employee', 'warehouse-manager', 'warehouse-employee', 'sales-manager', 'sales-employee', 'accountant-manager', 'accountant-employee');`);
  }
}

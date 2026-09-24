import { Migration } from '@mikro-orm/migrations';

export class Migration20260924120000_seed_permissions extends Migration {
  override name = 'Migration20260924120000_seed_permissions';

  override up(): void | Promise<void> {
    this.addSql(`insert into "permissions" ("id", "resource", "action", "is_active", "created_at", "updated_at") values
      ('users:read', 'users', 'read', true, now(), now()),
      ('users:write', 'users', 'write', true, now(), now()),
      ('users:delete', 'users', 'delete', true, now(), now()),
      ('auth_users:read', 'auth_users', 'read', true, now(), now()),
      ('auth_users:write', 'auth_users', 'write', true, now(), now()),
      ('auth_users:delete', 'auth_users', 'delete', true, now(), now()),
      ('customers:read', 'customers', 'read', true, now(), now()),
      ('customers:write', 'customers', 'write', true, now(), now()),
      ('customers:delete', 'customers', 'delete', true, now(), now()),
      ('employees:read', 'employees', 'read', true, now(), now()),
      ('employees:write', 'employees', 'write', true, now(), now()),
      ('employees:delete', 'employees', 'delete', true, now(), now());`);
  }

  override down(): void | Promise<void> {
    this.addSql(`delete from "permissions" where "id" in ('users:read', 'users:write', 'users:delete', 'auth_users:read', 'auth_users:write', 'auth_users:delete', 'customers:read', 'customers:write', 'customers:delete', 'employees:read', 'employees:write', 'employees:delete');`);
  }
}
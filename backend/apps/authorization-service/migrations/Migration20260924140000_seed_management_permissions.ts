import { Migration } from '@mikro-orm/migrations';

export class Migration20260924140000_seed_management_permissions extends Migration {
  override name = 'Migration20260924140000_seed_management_permissions';

  override up(): void | Promise<void> {
    this.addSql(`insert into "permissions" ("id", "resource", "action", "is_active", "created_at", "updated_at") values
      ('roles:read', 'roles', 'read', true, now(), now()),
      ('roles:write', 'roles', 'write', true, now(), now()),
      ('roles:delete', 'roles', 'delete', true, now(), now()),
      ('permissions:read', 'permissions', 'read', true, now(), now()),
      ('permissions:write', 'permissions', 'write', true, now(), now()),
      ('permissions:delete', 'permissions', 'delete', true, now(), now())
      on conflict ("id") do nothing;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`delete from "permissions" where "id" in ('roles:read', 'roles:write', 'roles:delete', 'permissions:read', 'permissions:write', 'permissions:delete');`);
  }
}
import { Migration } from '@mikro-orm/migrations';

export class Migration20260928090000_seed_audit_logs_permission extends Migration {
  override name = 'Migration20260928090000_seed_audit_logs_permission';

  override up(): void | Promise<void> {
    this.addSql(
      `insert into "permissions" ("id", "resource", "action", "is_active", "created_at", "updated_at") values
      ('audit_logs:read', 'audit_logs', 'read', true, now(), now())
      on conflict ("id") do nothing;`,
    );

    this.addSql(
      `insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('admin', 'audit_logs:read', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `delete from "roles_permissions" where "permission_id" = 'audit_logs:read';`,
    );
    this.addSql(`delete from "permissions" where "id" = 'audit_logs:read';`);
  }
}

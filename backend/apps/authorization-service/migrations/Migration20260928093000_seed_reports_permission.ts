import { Migration } from '@mikro-orm/migrations';

export class Migration20260928093000_seed_reports_permission extends Migration {
  override name = 'Migration20260928093000_seed_reports_permission';

  override up(): void | Promise<void> {
    this.addSql(
      `insert into "permissions" ("id", "resource", "action", "is_active", "created_at", "updated_at") values
      ('reports:read', 'reports', 'read', true, now(), now())
      on conflict ("id") do nothing;`,
    );

    this.addSql(
      `insert into "roles_permissions" ("role_id", "permission_id", "created_at", "updated_at") values
      ('admin', 'reports:read', now(), now())
      on conflict ("role_id", "permission_id") do nothing;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `delete from "roles_permissions" where "permission_id" = 'reports:read';`,
    );
    this.addSql(`delete from "permissions" where "id" = 'reports:read';`);
  }
}

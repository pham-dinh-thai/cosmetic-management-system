import { Migration } from '@mikro-orm/migrations';

export class Migration20260924130000_drop_permissions_resource_check extends Migration {
  override name = 'Migration20260924130000_drop_permissions_resource_check';

  override up(): void | Promise<void> {
    this.addSql(`alter table "permissions" drop constraint "permissions_resource_check";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "permissions" add constraint "permissions_resource_check" check ("resource" in ('users', 'auth_users', 'customers', 'employees'));`);
  }
}
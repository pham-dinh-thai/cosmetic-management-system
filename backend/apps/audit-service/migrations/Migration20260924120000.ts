import { Migration } from '@mikro-orm/migrations';

export class Migration20260924120000 extends Migration {

  override name = 'Migration20260924120000';

  override up(): void | Promise<void> {
    this.addSql(`alter table "audit_logs" drop constraint if exists "audit_logs_action_check";`);
    this.addSql(`alter table "audit_logs" add constraint "audit_logs_action_check" check ("action" in ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'ACTIVATE', 'DEACTIVATE', 'OTHER'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "audit_logs" drop constraint if exists "audit_logs_action_check";`);
    this.addSql(`alter table "audit_logs" add constraint "audit_logs_action_check" check ("action" in ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'OTHER'));`);
  }

}

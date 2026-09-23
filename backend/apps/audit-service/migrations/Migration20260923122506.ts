import { Migration } from '@mikro-orm/migrations';

export class Migration20260923122506 extends Migration {

  override name = 'Migration20260923122506';

  override up(): void | Promise<void> {
    this.addSql(`create table "audit_logs" ("id" uuid not null default gen_random_uuid(), "actor_id" varchar(255) null, "actor_name" varchar(255) null, "action" text not null, "entity_type" varchar(255) not null, "entity_id" varchar(255) null, "before_data" jsonb null, "after_data" jsonb null, "metadata" jsonb null, "ip_address" varchar(255) null, "user_agent" varchar(255) null, "created_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`alter table "audit_logs" add constraint "audit_logs_action_check" check ("action" in ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'OTHER'));`);

    this.addSql(`create index "audit_logs_entity_type_index" on "audit_logs" ("entity_type");`);
    this.addSql(`create index "audit_logs_entity_id_index" on "audit_logs" ("entity_id");`);
    this.addSql(`create index "audit_logs_actor_id_index" on "audit_logs" ("actor_id");`);
    this.addSql(`create index "audit_logs_action_index" on "audit_logs" ("action");`);
    this.addSql(`create index "audit_logs_created_at_index" on "audit_logs" ("created_at");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "audit_logs" cascade;`);
  }

}

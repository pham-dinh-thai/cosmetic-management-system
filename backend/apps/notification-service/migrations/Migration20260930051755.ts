import { Migration } from '@mikro-orm/migrations';

export class Migration20260930051755 extends Migration {
  override name = 'Migration20260930051755';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "email_logs" ("id" uuid not null default gen_random_uuid(), "order_id" varchar(255) not null, "event_type" varchar(255) not null, "recipient" varchar(255) not null, "subject" varchar(255) not null, "status" text not null, "provider_id" varchar(255) null, "error" text null, "created_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "email_logs" add constraint "email_logs_order_event_unique" unique ("order_id", "event_type");`,
    );
    this.addSql(
      `alter table "email_logs" add constraint "email_logs_status_check" check ("status" in ('sent', 'failed', 'skipped'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "email_logs" cascade;`);
  }
}

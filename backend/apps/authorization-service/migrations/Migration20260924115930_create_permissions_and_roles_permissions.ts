import { Migration } from '@mikro-orm/migrations';

export class Migration20260924115930_create_permissions_and_roles_permissions extends Migration {
  override name = 'Migration20260924115930_create_permissions_and_roles_permissions';

  override up(): void | Promise<void> {
    this.addSql(`create table "permissions" ("id" varchar(255) not null, "resource" text not null, "action" text not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`);

    this.addSql(`create table "roles_permissions" ("id" uuid not null default gen_random_uuid(), "role_id" varchar(255) not null, "permission_id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`);

    this.addSql(`alter table "permissions" add constraint "permissions_resource_check" check ("resource" in ('users', 'auth_users', 'customers', 'employees'));`);
    this.addSql(`alter table "permissions" add constraint "permissions_action_check" check ("action" in ('read', 'write', 'delete'));`);

    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_role_id_foreign" foreign key ("role_id") references "roles" ("id") on delete cascade;`);
    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on delete cascade;`);
    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_role_id_permission_id_unique" unique ("role_id", "permission_id");`);

    this.addSql(`alter table "roles" add "is_active" boolean not null default true, add "created_at" timestamptz not null default now(), add "updated_at" timestamptz not null default now();`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "roles_permissions" drop constraint "roles_permissions_permission_id_foreign";`);
    this.addSql(`alter table "roles_permissions" drop constraint "roles_permissions_role_id_permission_id_unique";`);

    this.addSql(`drop table if exists "permissions" cascade;`);
    this.addSql(`drop table if exists "roles_permissions" cascade;`);

    this.addSql(`alter table "roles" drop column "is_active", drop column "created_at", drop column "updated_at";`);
  }
}
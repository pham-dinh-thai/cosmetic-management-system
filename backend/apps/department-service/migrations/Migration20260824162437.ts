import { Migration } from '@mikro-orm/migrations';

export class Migration20260824162437 extends Migration {

  override name = 'Migration20260824162437';

  override up(): void | Promise<void> {
    this.addSql(`alter table "departments" add "code" varchar(255) not null, add "is_active" boolean not null default true;`);
    this.addSql(`alter table "departments" rename column "description" to "manager_id";`);
    this.addSql(`alter table "departments" add constraint "departments_code_unique" unique ("code");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "departments" drop constraint "departments_code_unique";`);
    this.addSql(`alter table "departments" drop column "code", drop column "is_active";`);
    this.addSql(`alter table "departments" rename column "manager_id" to "description";`);
  }

}

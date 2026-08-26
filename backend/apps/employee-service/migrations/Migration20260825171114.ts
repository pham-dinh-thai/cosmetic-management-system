import { Migration } from '@mikro-orm/migrations';

export class Migration20260825171114 extends Migration {

  override name = 'Migration20260825171114';

  override up(): void | Promise<void> {
    this.addSql(`alter table "employees" add "code" varchar(255) not null, add "department_id" varchar(255) not null, add "hired_at" timestamptz not null, add "status" varchar(255) not null, add "phone" varchar(255) not null, add "address" varchar(255) not null;`);
    this.addSql(`alter table "employees" add constraint "employees_code_unique" unique ("code");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "employees" drop constraint "employees_code_unique";`);
    this.addSql(`alter table "employees" drop column "code", drop column "department_id", drop column "hired_at", drop column "status", drop column "phone", drop column "address";`);
  }

}

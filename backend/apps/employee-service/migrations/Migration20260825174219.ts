import { Migration } from '@mikro-orm/migrations';

export class Migration20260825174219 extends Migration {

  override name = 'Migration20260825174219';

  override up(): void | Promise<void> {
    this.addSql(`alter table "employees" add "position" text not null;`);
    this.addSql(`alter table "employees" alter column "address" drop not null;`);
    this.addSql(`alter table "employees" alter column "phone" drop not null;`);
    this.addSql(`alter table "employees" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table "employees" add constraint "employees_status_check" check ("status" in ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'));`);
    this.addSql(`alter table "employees" add constraint "employees_position_check" check ("position" in ('staff', 'manager'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "employees" drop constraint "employees_status_check";`);
    this.addSql(`alter table "employees" drop constraint "employees_position_check";`);
    this.addSql(`alter table "employees" drop column "position";`);
    this.addSql(`alter table "employees" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "employees" alter column "phone" set not null;`);
    this.addSql(`alter table "employees" alter column "address" set not null;`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20260825174317 extends Migration {

  override name = 'Migration20260825174317';

  override up(): void | Promise<void> {
    this.addSql(`alter table "employees" alter column "status" set default 'ACTIVE';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "employees" alter column "status" drop default;`);
  }

}

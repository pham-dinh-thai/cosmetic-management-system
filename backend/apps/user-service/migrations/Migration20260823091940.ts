import { Migration } from '@mikro-orm/migrations';

export class Migration20260823091940 extends Migration {

  override name = 'Migration20260823091940';

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" alter column "role_id" set not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" alter column "role_id" drop not null;`);
  }

}

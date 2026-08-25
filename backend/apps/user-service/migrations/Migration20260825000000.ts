import { Migration } from '@mikro-orm/migrations';

export class Migration20260825000000 extends Migration {

  override name = 'Migration20260825000000';

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" drop column "phone";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" add column "phone" varchar(255) not null;`);
  }

}

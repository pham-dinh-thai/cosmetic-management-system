import { Migration } from '@mikro-orm/migrations';

export class Migration20260830070949 extends Migration {

  override name = 'Migration20260830070949';

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" add "is_active" boolean not null default true;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop column "is_active";`);
  }

}

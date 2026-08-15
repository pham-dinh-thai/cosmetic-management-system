import { Migration } from '@mikro-orm/migrations';

export class Migration20260812101306_rename_user_table extends Migration {
  override name = 'Migration20260812101306_rename_user_table';

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" rename to "users";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" rename to "user";`);
  }
}

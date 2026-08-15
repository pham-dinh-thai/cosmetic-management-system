import { Migration } from '@mikro-orm/migrations';

export class Migration20260813033952_rename_password_hash_to_password extends Migration {
  override name = 'Migration20260813033952_rename_password_hash_to_password';

  override up(): void | Promise<void> {
    this.addSql(
      `alter table "users" rename column "password_hash" to "password";`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "users" rename column "password" to "password_hash";`,
    );
  }
}

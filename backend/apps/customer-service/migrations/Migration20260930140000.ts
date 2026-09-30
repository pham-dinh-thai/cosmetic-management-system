import { Migration } from '@mikro-orm/migrations';

export class Migration20260930140000 extends Migration {
  override name = 'Migration20260930140000';

  override up(): void | Promise<void> {
    // Chuẩn hoá mã khách về KH_ + 5 chữ số (khớp NV_, NCC_, DH_...).
    // Cũ có 2 format: KH-003 (dấu gạch ngang) và CUS-1691646F (8 ký tự hex).
    // Đánh lại theo thứ tự created_at nên không đụng mã đã tồn tại.
    this.addSql(`
      with ranked as (
        select
          id,
          'KH_' || lpad(
            row_number() over (order by created_at, id)::text,
            5,
            '0'
          ) as new_code
        from customers
      )
      update customers c
      set code = ranked.new_code
      from ranked
      where c.id = ranked.id;
    `);
  }

  override down(): void | Promise<void> {
    this.addSql(`
      update customers set code = replace(code, 'KH_', 'KH-')
      where code ~ '^KH_[0-9]{5}$';
    `);
  }
}

import { Migration } from '@mikro-orm/migrations';

export class Migration20260930103000 extends Migration {
  override name = 'Migration20260930103000';

  override up(): void | Promise<void> {
    // Số điện thoại chưa có trong bảng phones. distinct on giữ khách cũ nhất
    // khi nhiều khách dùng chung một số (phones.phone là UNIQUE).
    this.addSql(`
      insert into phones (id, customer_id, phone, created_at, updated_at)
      select gen_random_uuid(), migrated.customer_id, migrated.phone, now(), now()
      from (
        select distinct on (c.phone) c.id as customer_id, c.phone
        from customers c
        where c.phone <> ''
          and not exists (select 1 from phones p where p.phone = c.phone)
        order by c.phone, c.created_at
      ) as migrated;
    `);

    // Chỉ chuyển địa chỉ cho khách chưa có địa chỉ nào trong bảng addresses.
    this.addSql(`
      insert into addresses (id, customer_id, city, street, created_at, updated_at)
      select gen_random_uuid(), c.id, '', c.address, now(), now()
      from customers c
      where c.address <> ''
        and not exists (select 1 from addresses a where a.customer_id = c.id);
    `);

    this.addSql(`alter table "customers" drop column if exists "phone";`);
    this.addSql(`alter table "customers" drop column if exists "address";`);
  }
}

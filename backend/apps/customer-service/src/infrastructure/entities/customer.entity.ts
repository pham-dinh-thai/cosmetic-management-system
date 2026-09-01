import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Address } from './address.entity';
import { Phone } from './phone.entity';

const CustomerSchema = defineEntity({
  name: 'Customer',
  tableName: 'customers',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    userId: p.string().unique(),
    code: p.string().unique(),
    addresses: () => p.oneToMany(Address).mappedBy('customer'),
    phones: () => p.oneToMany(Phone).mappedBy('customer'),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Customer extends CustomerSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

CustomerSchema.setClass(Customer);

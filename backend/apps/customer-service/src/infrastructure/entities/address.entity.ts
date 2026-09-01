import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Customer } from './customer.entity';

const AddressSchema = defineEntity({
  name: 'Address',
  tableName: 'addresses',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    customer: () =>
      p.manyToOne(Customer).fieldName('customer_id').deleteRule('cascade'),
    city: p.string(),
    street: p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Address extends AddressSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

AddressSchema.setClass(Address);

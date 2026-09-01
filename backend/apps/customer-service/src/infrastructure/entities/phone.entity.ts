import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Customer } from './customer.entity';

const PhoneSchema = defineEntity({
  name: 'Phone',
  tableName: 'phones',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    customer: () =>
      p.manyToOne(Customer).fieldName('customer_id').deleteRule('cascade'),
    phone: p.string().unique(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Phone extends PhoneSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

PhoneSchema.setClass(Phone);

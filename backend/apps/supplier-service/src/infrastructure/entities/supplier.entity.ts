import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const SupplierSchema = defineEntity({
  name: 'Supplier',
  tableName: 'suppliers',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    name: p.string(),
    email: p.string().unique(),
    phone: p.string().nullable(),
    address: p.string().nullable(),
    isActive: p.boolean().default(true),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Supplier extends SupplierSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isActive';
}

SupplierSchema.setClass(Supplier);

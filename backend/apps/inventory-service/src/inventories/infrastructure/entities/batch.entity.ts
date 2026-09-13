import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Inventory } from './inventory.entity';

const BatchSchema = defineEntity({
  name: 'Batch',
  tableName: 'batches',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    inventory: () =>
      p.manyToOne(Inventory).fieldName('inventory_id').deleteRule('cascade'),
    lotNumber: p.string(),
    supplierId: p.string(),
    quantity: p.integer().default(0),
    expiryDate: p.date(),
    isActive: p.boolean().default(true),
    createdBy: p.uuid(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
  indexes: [{ properties: ['inventory', 'expiryDate'] }],
  uniques: [{ properties: ['inventory', 'lotNumber'] }],
});

export class Batch extends BatchSchema.class {
  [OptionalProps]?: 'quantity' | 'createdAt' | 'updatedAt';
}

BatchSchema.setClass(Batch);

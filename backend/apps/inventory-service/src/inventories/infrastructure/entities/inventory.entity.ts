import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Batch } from './batch.entity';

const InventorySchema = defineEntity({
  name: 'Inventory',
  tableName: 'inventories',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    variantId: p.string().unique(),
    minStock: p.integer().default(0),
    isActive: p.boolean().default(true),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
    batches: () => p.oneToMany(Batch).mappedBy('inventory'),
  },
});

export class Inventory extends InventorySchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

InventorySchema.setClass(Inventory);

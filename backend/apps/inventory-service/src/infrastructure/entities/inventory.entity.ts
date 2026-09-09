import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const InventorySchema = defineEntity({
  name: 'Inventory',
  tableName: 'inventories',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    variantId: p.string().unique(),
    quantity: p.integer().default(0),
    minStock: p.integer().default(0),
    expiryDate: p.date().nullable(),
    isActive: p.boolean().default(true),
    createdBy: p.uuid().nullable(),
    lastUpdatedAt: p.datetime().onCreate(() => new Date()),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Inventory extends InventorySchema.class {
  [OptionalProps]?:
    | 'quantity'
    | 'minStock'
    | 'expiryDate'
    | 'lastUpdatedAt'
    | 'createdAt'
    | 'updatedAt';
}

InventorySchema.setClass(Inventory);

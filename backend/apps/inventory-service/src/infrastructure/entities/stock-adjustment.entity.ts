import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const StockAdjustmentSchema = defineEntity({
  name: 'StockAdjustment',
  tableName: 'stock_adjustments',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    inventoryId: p.uuid(),
    variantId: p.string(),
    adjustment: p.integer(),
    reason: p.string(),
    note: p.string().nullable(),
    createdBy: p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class StockAdjustment extends StockAdjustmentSchema.class {
  [OptionalProps]?: 'note' | 'createdAt' | 'updatedAt';
}

StockAdjustmentSchema.setClass(StockAdjustment);

import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Batch } from '../../../inventories/infrastructure/entities/batch.entity';

const StockAdjustmentSchema = defineEntity({
  name: 'StockAdjustment',
  tableName: 'stock_adjustments',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    batch: () =>
      p.manyToOne(Batch).fieldName('batch_id').deleteRule('cascade'),
    variantId: p.string().fieldName('variant_id'),
    adjustment: p.integer(),
    reason: p.string(),
    note: p.string().nullable(),
    createdBy: p.uuid().fieldName('created_by'),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .fieldName('updated_at')
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
  indexes: [{ properties: ['batch'] }],
});

export class StockAdjustment extends StockAdjustmentSchema.class {
  [OptionalProps]?: 'note' | 'createdAt' | 'updatedAt';
}

StockAdjustmentSchema.setClass(StockAdjustment);
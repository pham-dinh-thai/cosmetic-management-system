import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Cosmetic } from './cosmetic.entity';

const CosmeticVariantSchema = defineEntity({
  name: 'CosmeticVariant',
  tableName: 'cosmetic_variants',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    cosmetic: () =>
      p.manyToOne(Cosmetic).fieldName('cosmetic_id').deleteRule('cascade'),
    name: p.string(),
    color: p.string().nullable(),
    volume: p.string().nullable(),
    price: p.decimal('number').precision(12).scale(2),
    costPrice: p.decimal('number').precision(12).scale(2).nullable(),
    isActive: p.boolean().default(true),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class CosmeticVariant extends CosmeticVariantSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isActive';
}

CosmeticVariantSchema.setClass(CosmeticVariant);

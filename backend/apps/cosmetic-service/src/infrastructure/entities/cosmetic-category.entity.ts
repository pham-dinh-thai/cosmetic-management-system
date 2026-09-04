import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Cosmetic } from './cosmetic.entity';

const CosmeticCategorySchema = defineEntity({
  name: 'CosmeticCategory',
  tableName: 'cosmetic_categories',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    cosmetic: () =>
      p.manyToOne(Cosmetic).fieldName('cosmetic_id').deleteRule('cascade'),
    categoryId: p.uuid(),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export class CosmeticCategory extends CosmeticCategorySchema.class {
  [OptionalProps]?: 'createdAt';
}

CosmeticCategorySchema.setClass(CosmeticCategory);

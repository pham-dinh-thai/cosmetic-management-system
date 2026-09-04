import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { CosmeticVariant } from './cosmetic-variant.entity';
import { CosmeticCategory } from './cosmetic-category.entity';

const CosmeticSchema = defineEntity({
  name: 'Cosmetic',
  tableName: 'cosmetics',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    name: p.string(),
    brand: p.string().nullable(),
    origin: p.string().nullable(),
    description: p.string().columnType('varchar(1000)').nullable(),
    imageUrl: p.string().columnType('varchar(500)').nullable(),
    variants: () => p.oneToMany(CosmeticVariant).mappedBy('cosmetic'),
    categories: () => p.oneToMany(CosmeticCategory).mappedBy('cosmetic'),
    isActive: p.boolean().default(true),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Cosmetic extends CosmeticSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isActive';
}

CosmeticSchema.setClass(Cosmetic);

import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const CategorySchema = defineEntity({
  name: 'Category',
  tableName: 'categories',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string().unique(),
    description: p.string().nullable(),
    isActive: p.boolean().default(true),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Category extends CategorySchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isActive';
}

CategorySchema.setClass(Category);

import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const DepartmentSchema = defineEntity({
  name: 'Department',
  tableName: 'departments',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string().unique(),
    description: p.string().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Department extends DepartmentSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

DepartmentSchema.setClass(Department);

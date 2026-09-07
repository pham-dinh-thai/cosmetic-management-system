import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const DepartmentSchema = defineEntity({
  name: 'Department',
  tableName: 'departments',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    name: p.string().unique(),
    managerId: p.string().nullable(),
    isActive: p.boolean().default(true),
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

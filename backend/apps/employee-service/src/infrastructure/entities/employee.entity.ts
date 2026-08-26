import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Position } from '../../domain/enums/position.enum';
import { EmployeeStatus } from '../../domain/enums/employee-status.enum';

const EmployeeSchema = defineEntity({
  name: 'Employee',
  tableName: 'employees',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    userId: p.string().unique(),
    code: p.string().unique(),
    departmentId: p.string(),
    hiredAt: p.datetime(),
    status: p.enum(() => EmployeeStatus).default(EmployeeStatus.ACTIVE),
    phone: p.string().nullable(),
    address: p.string().nullable(),
    position: p.enum(() => Position),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Employee extends EmployeeSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

EmployeeSchema.setClass(Employee);

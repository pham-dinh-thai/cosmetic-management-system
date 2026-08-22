import { defineEntity, p } from '@mikro-orm/core';

const RoleSchema = defineEntity({
  name: 'Role',
  tableName: 'roles',
  properties: {
    id: p.string().primary(),
    name: p.string(),
  },
});

export class Role extends RoleSchema.class {}

RoleSchema.setClass(Role);

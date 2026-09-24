import { defineEntity, p } from '@mikro-orm/core';
import { RolePermission } from './roles_permissions.entity';

const RoleSchema = defineEntity({
  name: 'Role',
  tableName: 'roles',
  properties: {
    id: p.string().primary(),
    name: p.string(),
    rolePermissions: () => p.oneToMany(RolePermission).mappedBy('role'),
    isActive: p.boolean().default(true).fieldName('is_active'),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .defaultRaw('now()')
      .onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .fieldName('updated_at')
      .defaultRaw('now()')
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Role extends RoleSchema.class {}

RoleSchema.setClass(Role);

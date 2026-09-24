import { defineEntity, p } from '@mikro-orm/core';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

const RolePermissionSchema = defineEntity({
  name: 'RolePermission',
  tableName: 'roles_permissions',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    role: () => p.manyToOne(Role).fieldName('role_id').deleteRule('cascade'),
    permission: () =>
      p.manyToOne(Permission).fieldName('permission_id').deleteRule('cascade'),
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

export class RolePermission extends RolePermissionSchema.class {}

RolePermissionSchema.setClass(RolePermission);

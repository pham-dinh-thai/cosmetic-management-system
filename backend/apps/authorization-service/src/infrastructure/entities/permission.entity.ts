import { defineEntity, p } from '@mikro-orm/core';
import { Resource } from '../../domain/permission/enums/resource.enum';
import { Action } from '../../domain/permission/enums/action.enum';
import { RolePermission } from './roles_permissions.entity';

const PermissionSchema = defineEntity({
  name: 'Permission',
  tableName: 'permissions',
  properties: {
    id: p.string().primary(), // id will be something like 'resource:action', for example: 'users:read'
    resource: p.enum(Resource),
    action: p.enum(Action),
    rolePermissions: () => p.oneToMany(RolePermission).mappedBy('permission'),
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

export class Permission extends PermissionSchema.class {}

PermissionSchema.setClass(Permission);

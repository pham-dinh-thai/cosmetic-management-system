import { Role } from '../../domain/role.aggregate';
import { Role as RoleMikro } from '../entities/role.entity';

export class RolesMapper {
  public static toDomain(roleMikro: RoleMikro): Role {
    return Role.fromPersistent({
      id: roleMikro.id,
      name: roleMikro.name,
      permissions: roleMikro.rolePermissions
        .getItems()
        .map((rolePermission) => ({
          id: rolePermission.permission.id,
          resource: rolePermission.permission.resource,
          action: rolePermission.permission.action,
          isActive: rolePermission.permission.isActive,
          createdAt: rolePermission.permission.createdAt,
          updatedAt: rolePermission.permission.updatedAt,
        })),
      isActive: roleMikro.isActive,
      createdAt: roleMikro.createdAt,
      updatedAt: roleMikro.updatedAt,
    });
  }

  public static toMikro(role: Role): RoleMikro {
    const roleMikro = new RoleMikro();

    roleMikro.id = role.getId();
    roleMikro.name = role.getName();
    roleMikro.isActive = role.getIsActive();
    roleMikro.createdAt = role.getCreatedAt();
    roleMikro.updatedAt = role.getUpdatedAt();

    return roleMikro;
  }
}

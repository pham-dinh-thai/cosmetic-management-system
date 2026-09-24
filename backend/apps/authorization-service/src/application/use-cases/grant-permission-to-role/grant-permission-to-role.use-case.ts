import { PermissionNotFoundException } from 'apps/authorization-service/src/domain/exceptions/permission-not-found.exception';
import { RoleNotFoundException } from 'apps/authorization-service/src/domain/exceptions/role-not-found.exception';
import { IPermissionsRepository } from 'apps/authorization-service/src/domain/permission/repositories/permissions.repository';
import { IRolesRepository } from 'apps/authorization-service/src/domain/repositories/roles.repository';
import { IGrantPermissionToRoleRequest } from './grant-permission-to-role.request';

export class GrantPermissionToRoleUseCase {
  public constructor(
    private readonly rolesRepository: IRolesRepository,
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  public async execute(
    id: string,
    request: IGrantPermissionToRoleRequest,
  ): Promise<void> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException(id);
    }

    role.clearPermissions();

    for (const permissionId of request.permissionIds) {
      const permission =
        await this.permissionsRepository.findById(permissionId);

      if (!permission) {
        throw new PermissionNotFoundException(permissionId);
      }

      role.grantPermission(permission);
    }

    await this.rolesRepository.syncPermissions(role);
  }
}

export const grantPermissionToRoleUseCaseFactory = (
  rolesRepository: IRolesRepository,
  permissionsRepository: IPermissionsRepository,
) => new GrantPermissionToRoleUseCase(rolesRepository, permissionsRepository);

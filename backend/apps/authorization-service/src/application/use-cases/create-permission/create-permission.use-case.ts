import { IPermissionsRepository } from 'apps/authorization-service/src/domain/permission/repositories/permissions.repository';
import { ICreatePermissionRequest } from './create-permission.request';
import { PermissionAlreadyExistsException } from 'apps/authorization-service/src/domain/exceptions/permission-already-exists.exception';
import { Permission } from 'apps/authorization-service/src/domain/permission/permission.aggregate';

export class CreatePermissionUseCase {
  public constructor(
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  public async execute(request: ICreatePermissionRequest): Promise<void> {
    const existing = await this.permissionsRepository.findById(
      `${request.resource}:${request.action}`,
    );

    if (existing) {
      throw new PermissionAlreadyExistsException(
        `${request.resource}:${request.action}`,
      );
    }

    const permission = Permission.create({
      resource: request.resource,
      action: request.action,
    });

    await this.permissionsRepository.create(permission);
  }
}

export const createPermissionUseCaseFactory = (
  permissionsRepository: IPermissionsRepository,
) => new CreatePermissionUseCase(permissionsRepository);

import { PermissionNotFoundException } from 'apps/authorization-service/src/domain/exceptions/permission-not-found.exception';
import { IPermissionsRepository } from 'apps/authorization-service/src/domain/permission/repositories/permissions.repository';

export class DeactivatePermissionUseCase {
  public constructor(
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const permission = await this.permissionsRepository.findById(id);

    if (!permission) {
      throw new PermissionNotFoundException(id);
    }

    permission.deactivate();

    await this.permissionsRepository.setIsActive(permission);
  }
}

export const deactivatePermissionUseCaseFactory = (
  permissionsRepository: IPermissionsRepository,
) => new DeactivatePermissionUseCase(permissionsRepository);

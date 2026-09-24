import { PermissionNotFoundException } from 'apps/authorization-service/src/domain/exceptions/permission-not-found.exception';
import { IPermissionsRepository } from 'apps/authorization-service/src/domain/permission/repositories/permissions.repository';

export class ActivatePermissionUseCase {
  public constructor(
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const permission = await this.permissionsRepository.findById(id);

    if (!permission) {
      throw new PermissionNotFoundException(id);
    }

    permission.activate();

    await this.permissionsRepository.setIsActive(permission);
  }
}

export const activatePermissionUseCaseFactory = (
  permissionsRepository: IPermissionsRepository,
) => new ActivatePermissionUseCase(permissionsRepository);

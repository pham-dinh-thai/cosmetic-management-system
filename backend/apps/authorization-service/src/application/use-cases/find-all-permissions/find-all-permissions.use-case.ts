import { IPermissionsRepository } from 'apps/authorization-service/src/domain/permission/repositories/permissions.repository';
import { FindAllPermissionsReadModel } from './find-all-permissions.read-model';

export class FindAllPermissionsUseCase {
  public constructor(
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  public async execute(): Promise<FindAllPermissionsReadModel[]> {
    const permissions = await this.permissionsRepository.findAll();

    return permissions.map(
      (permission) =>
        new FindAllPermissionsReadModel(
          permission.getId(),
          permission.getResource(),
          permission.getAction(),
          permission.getIsActive(),
          permission.getCreatedAt(),
          permission.getUpdatedAt(),
        ),
    );
  }
}

export const findAllPermissionsUseCaseFactory = (
  permissionsRepository: IPermissionsRepository,
) => new FindAllPermissionsUseCase(permissionsRepository);

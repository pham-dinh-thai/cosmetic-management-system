import { IRolesRepository } from 'apps/authorization-service/src/domain/repositories/roles.repository';
import { FindRoleByIdReadModel } from './find-role-by-id.read-model';

export class FindRoleByIdUseCase {
  public constructor(private readonly rolesRepository: IRolesRepository) {}

  public async execute(id: string): Promise<FindRoleByIdReadModel | null> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      return null;
    }

    return new FindRoleByIdReadModel(
      role.getId(),
      role.getName(),
      role.getIsActive(),
      role.getPermissions().map((permission) => ({
        id: permission.getId(),
        resource: permission.getResource(),
        action: permission.getAction(),
        isActive: permission.getIsActive(),
      })),
    );
  }
}

export const findRoleByIdUseCaseFactory = (rolesRepository: IRolesRepository) =>
  new FindRoleByIdUseCase(rolesRepository);

import { RoleNotFoundException } from 'apps/authorization-service/src/domain/exceptions/role-not-found.exception';
import { IRolesRepository } from 'apps/authorization-service/src/domain/repositories/roles.repository';

export class DeactivateRoleUseCase {
  public constructor(private readonly rolesRepository: IRolesRepository) {}

  public async execute(id: string): Promise<void> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException(id);
    }

    role.deactivate();

    await this.rolesRepository.setIsActive(role);
  }
}

export const deactivateRoleUseCaseFactory = (
  rolesRepository: IRolesRepository,
) => new DeactivateRoleUseCase(rolesRepository);

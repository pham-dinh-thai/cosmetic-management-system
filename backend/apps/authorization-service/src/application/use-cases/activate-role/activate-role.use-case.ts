import { RoleNotFoundException } from 'apps/authorization-service/src/domain/exceptions/role-not-found.exception';
import { IRolesRepository } from 'apps/authorization-service/src/domain/repositories/roles.repository';

export class ActivateRoleUseCase {
  public constructor(private readonly rolesRepository: IRolesRepository) {}

  public async execute(id: string): Promise<void> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException(id);
    }

    role.activate();

    await this.rolesRepository.setIsActive(role);
  }
}

export const activateRoleUseCaseFactory = (rolesRepository: IRolesRepository) =>
  new ActivateRoleUseCase(rolesRepository);

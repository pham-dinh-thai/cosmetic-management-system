import { RoleNotFoundException } from 'apps/authorization-service/src/domain/exceptions/role-not-found.exception';
import { IRolesRepository } from '../../../domain/repositories/roles.repository';

export class DeleteRoleUseCase {
  public constructor(private readonly rolesRepository: IRolesRepository) {}

  public async execute(id: string): Promise<void> {
    const isDeleted = await this.rolesRepository.delete(id);

    if (!isDeleted) {
      throw new RoleNotFoundException(id);
    }
  }
}

export const deleteRoleUseCaseFactory = (rolesRepository: IRolesRepository) =>
  new DeleteRoleUseCase(rolesRepository);

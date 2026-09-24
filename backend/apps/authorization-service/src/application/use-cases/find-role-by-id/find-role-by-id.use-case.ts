import { IRolesRepository } from 'apps/authorization-service/src/domain/repositories/roles.repository';
import { FindRoleByIdReadModel } from './find-role-by-id.read-model';

export class FindRoleByIdUseCase {
  public constructor(private readonly rolesRepository: IRolesRepository) {}

  public async execute(id: string): Promise<FindRoleByIdReadModel | null> {
    const role = await this.rolesRepository.findById(id);

    return role
      ? new FindRoleByIdReadModel(role.getId(), role.getName())
      : null;
  }
}

export const findRoleByIdUseCaseFactory = (rolesRepository: IRolesRepository) =>
  new FindRoleByIdUseCase(rolesRepository);

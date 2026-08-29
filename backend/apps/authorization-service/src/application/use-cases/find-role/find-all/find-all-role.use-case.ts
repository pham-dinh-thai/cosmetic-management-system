import { IRolesRepository } from 'apps/authorization-service/src/domain/repositories/roles.repository';
import { FindAllRoleReadModel } from './find-all-role.read-model';

export class FindAllRoleUseCase {
  public constructor(private readonly rolesRepository: IRolesRepository) {}

  public async execute(): Promise<FindAllRoleReadModel[]> {
    const roles = await this.rolesRepository.findAll();

    return roles.map(
      (role) => new FindAllRoleReadModel(role.getId(), role.getName()),
    );
  }
}

export const findAllRoleUseCaseFactory = (rolesRepository: IRolesRepository) =>
  new FindAllRoleUseCase(rolesRepository);

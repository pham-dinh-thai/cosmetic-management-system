import { IRolesRepository } from 'apps/authorization-service/src/domain/repositories/roles.repository';
import { FindAllRolesReadModel } from './find-all-roles.read-model';

export class FindAllRolesUseCase {
  public constructor(private readonly rolesRepository: IRolesRepository) {}

  public async execute(): Promise<FindAllRolesReadModel[]> {
    const roles = await this.rolesRepository.findAll();

    return roles.map(
      (role) =>
        new FindAllRolesReadModel(
          role.getId(),
          role.getName(),
          role.getIsActive(),
        ),
    );
  }
}

export const findAllRolesUseCaseFactory = (rolesRepository: IRolesRepository) =>
  new FindAllRolesUseCase(rolesRepository);

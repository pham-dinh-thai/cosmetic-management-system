import { ICreateRoleRequest } from './create-role.request';
import { Role } from '../../../domain/role.aggregate';
import { IRolesRepository } from '../../../domain/repositories/roles.repository';
import { RoleAlreadyExistsException } from 'apps/authorization-service/src/domain/exceptions/role-already-exists.exception';

export class CreateRoleUseCase {
  public constructor(private readonly rolesRepository: IRolesRepository) {}

  public async execute(request: ICreateRoleRequest): Promise<void> {
    const role = Role.create(request.name);

    const existing = await this.rolesRepository.findById(role.getId());

    if (existing) {
      throw new RoleAlreadyExistsException(role.getId());
    }

    await this.rolesRepository.create(role);
  }
}

export const createRoleUseCaseFactory = (rolesRepository: IRolesRepository) =>
  new CreateRoleUseCase(rolesRepository);

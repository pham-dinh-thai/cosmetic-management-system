import { Inject, Injectable } from '@nestjs/common';
import { ICreateRoleRequest } from './create-role.request';
import { Role } from '../../../domain/role.aggregate';
import {
  type IRolesRepository,
  ROLES_REPOSITORY,
} from '../../../domain/repositories/roles.repository';

@Injectable()
export class CreateRoleUseCase {
  public constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  public async execute(request: ICreateRoleRequest): Promise<void> {
    const role = Role.create(request.name);

    await this.rolesRepository.create(role);
  }
}

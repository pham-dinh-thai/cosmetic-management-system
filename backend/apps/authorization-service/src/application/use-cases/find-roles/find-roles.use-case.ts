import { Inject, Injectable } from '@nestjs/common';
import {
  type IRolesRepository,
  ROLES_REPOSITORY,
} from '../../../domain/repositories/roles.repository';
import { RoleReadModel } from '../../../domain/read-models/role.read-model';

@Injectable()
export class FindRolesUseCase {
  public constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  public async execute(): Promise<RoleReadModel[]> {
    return await this.rolesRepository.findAll();
  }
}

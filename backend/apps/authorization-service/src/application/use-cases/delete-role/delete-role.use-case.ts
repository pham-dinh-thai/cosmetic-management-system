import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IRolesRepository,
  ROLES_REPOSITORY,
} from '../../../domain/repositories/roles.repository';

@Injectable()
export class DeleteRoleUseCase {
  public constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const isDeleted = await this.rolesRepository.delete(id);

    if (!isDeleted) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
  }
}

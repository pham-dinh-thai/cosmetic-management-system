import { Injectable } from '@nestjs/common';
import { IRolesRepository } from '../../domain/roles.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Role } from '../../domain/role.aggregate';
import { RolesMapper } from '../mappers/roles.mapper';

@Injectable()
export class MikroRolesRepository implements IRolesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async create(role: Role): Promise<void> {
    this.entityManager.persist(RolesMapper.toMikro(role));

    await this.entityManager.flush();
  }
}

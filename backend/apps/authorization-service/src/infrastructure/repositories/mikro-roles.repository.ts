import { Injectable } from '@nestjs/common';
import { IRolesRepository } from '../../domain/repositories/roles.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { RolesMapper } from '../mappers/roles.mapper';
import { Role as RoleMikro } from '../entities/role.entity';
import { Role } from '../../domain/role.aggregate';

@Injectable()
export class MikroRolesRepository implements IRolesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<Role[]> {
    const rolesMikro = await this.entityManager.findAll(RoleMikro);

    return rolesMikro.map((roleMikro) => RolesMapper.toDomain(roleMikro));
  }

  public async findById(id: string): Promise<Role | null> {
    const roleMikro = await this.entityManager.findOne(RoleMikro, { id });

    return roleMikro ? RolesMapper.toDomain(roleMikro) : null;
  }

  public async create(role: Role): Promise<void> {
    this.entityManager.persist(RolesMapper.toMikro(role));

    await this.entityManager.flush();
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.entityManager.nativeDelete(RoleMikro, { id });

    return result > 0;
  }
}

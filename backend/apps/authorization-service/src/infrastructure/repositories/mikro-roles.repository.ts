import { Injectable } from '@nestjs/common';
import { IRolesRepository } from '../../domain/repositories/roles.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { RolesMapper } from '../mappers/roles.mapper';
import { Role as RoleMikro } from '../entities/role.entity';
import { Role } from '../../domain/role.aggregate';
import { RolePermission as RolePermissionMikro } from '../entities/roles_permissions.entity';

@Injectable()
export class MikroRolesRepository implements IRolesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<Role[]> {
    const rolesMikro = await this.entityManager.findAll(RoleMikro, {
      populate: ['rolePermissions.permission'],
    });

    return rolesMikro.map((roleMikro) => RolesMapper.toDomain(roleMikro));
  }

  public async findById(id: string): Promise<Role | null> {
    const roleMikro = await this.entityManager.findOne(
      RoleMikro,
      { id },
      { populate: ['rolePermissions.permission'] },
    );

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

  public async setIsActive(role: Role): Promise<void> {
    await this.entityManager.nativeUpdate(
      RoleMikro,
      { id: role.getId() },
      {
        isActive: role.getIsActive(),
        updatedAt: role.getUpdatedAt(),
      },
    );
  }

  public async syncPermissions(role: Role): Promise<void> {
    const roleId = role.getId();
    const permissionIds = role.getPermissions().map((p) => p.getId());

    await this.entityManager.transactional(async (em) => {
      await em.nativeDelete(RolePermissionMikro, { role: roleId });

      if (permissionIds.length > 0) {
        const queryBuilder = em.createQueryBuilder(RolePermissionMikro);
        await queryBuilder
          .insert(
            permissionIds.map((permissionId) => ({
              role: roleId,
              permission: permissionId,
            })),
          )
          .execute();
      }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '../../domain/permission/repositories/permissions.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Permission as PermissionMikro } from '../entities/permission.entity';
import { Permission } from '../../domain/permission/permission.aggregate';

@Injectable()
export class MikroPermissionsRepository implements IPermissionsRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<Permission[]> {
    const permissionsMikro = await this.entityManager.findAll(PermissionMikro);

    return permissionsMikro.map((permissionMikro) =>
      Permission.fromPersistent({
        id: permissionMikro.id,
        resource: permissionMikro.resource,
        action: permissionMikro.action,
        isActive: permissionMikro.isActive,
        createdAt: permissionMikro.createdAt,
        updatedAt: permissionMikro.updatedAt,
      }),
    );
  }

  public async findById(id: string): Promise<Permission | null> {
    const permissionMikro = await this.entityManager.findOne(PermissionMikro, {
      id,
    });

    return permissionMikro
      ? Permission.fromPersistent({
          id: permissionMikro.id,
          resource: permissionMikro.resource,
          action: permissionMikro.action,
          isActive: permissionMikro.isActive,
          createdAt: permissionMikro.createdAt,
          updatedAt: permissionMikro.updatedAt,
        })
      : null;
  }

  public async create(permission: Permission): Promise<void> {
    const permissionMikro = this.entityManager.create(PermissionMikro, {
      id: permission.getId(),
      resource: permission.getResource(),
      action: permission.getAction(),
      isActive: permission.getIsActive(),
      createdAt: permission.getCreatedAt(),
      updatedAt: permission.getUpdatedAt(),
    });

    this.entityManager.persist(permissionMikro);

    await this.entityManager.flush();
  }

  public async setIsActive(permission: Permission): Promise<void> {
    await this.entityManager.nativeUpdate(
      PermissionMikro,
      { id: permission.getId() },
      {
        isActive: permission.getIsActive(),
        updatedAt: permission.getUpdatedAt(),
      },
    );
  }
}

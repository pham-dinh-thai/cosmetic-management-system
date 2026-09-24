import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { AuthUser as AuthUserMikro } from '../entities/auth-user.entity';
import { AuthUser } from '../../domain/auth-user.aggregate';
import { IAuthUsersRepository } from '../../domain/repositories/auth-users.repository';

@Injectable()
export class MikroAuthUsersRepository implements IAuthUsersRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findByUserId(userId: string): Promise<AuthUser | null> {
    const authUser = await this.entityManager.findOne(AuthUserMikro, {
      userId,
    });

    return authUser
      ? AuthUser.fromPersistent({
          id: authUser.id,
          userId: authUser.userId,
          password: authUser.password,
          createdAt: authUser.createdAt,
          updatedAt: authUser.updatedAt,
        })
      : null;
  }

  public async create(authUser: AuthUser): Promise<void> {
    const authUserMikro = this.entityManager.create(AuthUserMikro, {
      userId: authUser.getUserId(),
      password: authUser.getPassword(),
      createdAt: authUser.getCreatedAt(),
      updatedAt: authUser.getUpdatedAt(),
    });

    this.entityManager.persist(authUserMikro);

    await this.entityManager.flush();
  }

  public async changePassword(authUser: AuthUser): Promise<void> {
    await this.entityManager.nativeUpdate(
      AuthUserMikro,
      {
        id: authUser.getId(),
      },
      {
        password: authUser.getPassword(),
        updatedAt: authUser.getUpdatedAt(),
      },
    );
  }

  public async deleteByUserId(userId: string): Promise<boolean> {
    const result = await this.entityManager.nativeDelete(AuthUserMikro, {
      userId,
    });

    return result > 0;
  }
}

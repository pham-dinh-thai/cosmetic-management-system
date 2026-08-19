import { Injectable } from '@nestjs/common';
import { IAuthUsersCommandRepository } from '../../domain/repositories/auth-users-command.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { AuthUser as AuthUserMikro } from '../entities/auth-user.entity';
import { AuthUser } from '../../domain/auth-user.aggregate';
import { AuthUsersMapper } from '../mappers/auth-users.mapper';

@Injectable()
export class MikroAuthUsersCommandRepository implements IAuthUsersCommandRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async create(authUser: AuthUser): Promise<void> {
    this.entityManager.persist(AuthUsersMapper.toMikro(authUser));

    await this.entityManager.flush();
  }
}

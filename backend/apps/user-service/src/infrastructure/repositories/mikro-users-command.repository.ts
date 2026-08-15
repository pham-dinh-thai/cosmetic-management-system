import { Injectable } from '@nestjs/common';
import { IUsersCommandRepository } from '../../domain/repositories/users-command.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../domain/user.aggregate';
import { UsersMapper } from '../mappers/users.mapper';

@Injectable()
export class MikroUsersCommandRepository implements IUsersCommandRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async create(user: User): Promise<void> {
    this.entityManager.persist(UsersMapper.toMikro(user));

    await this.entityManager.flush();
  }
}

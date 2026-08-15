import { Injectable } from '@nestjs/common';
import { IUsersCommandRepository } from '../../domain/repositories/users-command.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../domain/user.aggregate';
import { User as UserMikro } from '../entities/user.entity';
import { UsersMapper } from '../mappers/users.mapper';

@Injectable()
export class MikroUsersCommandRepository implements IUsersCommandRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async create(user: User): Promise<void> {
    this.entityManager.persist(UsersMapper.toMikro(user));

    await this.entityManager.flush();
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.entityManager.nativeDelete(UserMikro, { id });

    return result > 0;
  }
}

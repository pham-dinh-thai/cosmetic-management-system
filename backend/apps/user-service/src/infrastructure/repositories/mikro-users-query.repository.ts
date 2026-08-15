import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { IUsersQueryRepository } from '../../domain/repositories/users-query.repository';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { User } from '../entities/user.entity';

@Injectable()
export class MikroUsersQueryRepository implements IUsersQueryRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findById(id: string): Promise<UserReadModel | null> {
    const user = await this.entityManager.findOne(User, { id });

    return user ? new UserReadModel(user.id, user.email, user.name) : null;
  }
}

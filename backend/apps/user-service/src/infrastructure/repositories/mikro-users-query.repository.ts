import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { IUsersQueryRepository } from '../../domain/repositories/users-query.repository';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { User } from '../entities/user.entity';
import { UsersMapper } from '../mappers/users.mapper';

@Injectable()
export class MikroUsersQueryRepository implements IUsersQueryRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<UserReadModel[]> {
    const users = await this.entityManager.findAll(User);

    return users.map((user) => UsersMapper.toReadModel(user));
  }

  public async findById(id: string): Promise<UserReadModel | null> {
    const user = await this.entityManager.findOne(User, { id });

    return user ? UsersMapper.toReadModel(user) : null;
  }

  public async findByEmail(email: string): Promise<UserReadModel | null> {
    const user = await this.entityManager.findOne(User, { email });

    return user ? UsersMapper.toReadModel(user) : null;
  }
}

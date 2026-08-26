import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../domain/repositories/users.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { User as UserMikro } from '../entities/user.entity';
import { UsersMapper } from '../mappers/users.mapper';
import { User } from '../../domain/user.aggregate';

@Injectable()
export class MikroUsersRepository implements IUsersRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<UserReadModel[]> {
    const usersMikro = await this.entityManager.findAll(UserMikro);

    return usersMikro.map((userMikro) => UsersMapper.toReadModel(userMikro));
  }

  public async findById(id: string): Promise<UserReadModel | null> {
    const userMikro = await this.entityManager.findOne(UserMikro, { id });

    return userMikro ? UsersMapper.toReadModel(userMikro) : null;
  }

  public async findByEmail(email: string): Promise<UserReadModel | null> {
    const userMikro = await this.entityManager.findOne(UserMikro, { email });

    return userMikro ? UsersMapper.toReadModel(userMikro) : null;
  }

  public async create(user: User): Promise<{ id: string }> {
    const userMikro = UsersMapper.toMikro(user);

    this.entityManager.persist(userMikro);

    await this.entityManager.flush();

    return { id: userMikro.id };
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.entityManager.nativeDelete(UserMikro, { id });

    return result > 0;
  }
}

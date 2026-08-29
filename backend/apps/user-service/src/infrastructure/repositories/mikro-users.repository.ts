import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../domain/repositories/users.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { User as UserMikro } from '../entities/user.entity';
import { UsersMapper } from '../mappers/users.mapper';
import { User } from '../../domain/user.aggregate';

@Injectable()
export class MikroUsersRepository implements IUsersRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<User[]> {
    const usersMikro = await this.entityManager.findAll(UserMikro);

    return usersMikro.map((userMikro) => UsersMapper.toDomain(userMikro));
  }

  public async findById(id: string): Promise<User | null> {
    const userMikro = await this.entityManager.findOne(UserMikro, { id });

    return userMikro ? UsersMapper.toDomain(userMikro) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const userMikro = await this.entityManager.findOne(UserMikro, { email });

    return userMikro ? UsersMapper.toDomain(userMikro) : null;
  }

  public async create(user: User): Promise<{ id: string }> {
    const userMikro = UsersMapper.toMikro(user);

    this.entityManager.persist(userMikro);

    await this.entityManager.flush();

    return { id: userMikro.id };
  }

  public async updateInformation(user: User): Promise<void> {
    await this.entityManager.nativeUpdate(
      UserMikro,
      { id: user.getId() },
      {
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        gender: user.getGender(),
        updatedAt: new Date(),
      },
    );
  }

  public async delete(id: string): Promise<User | null> {
    const userMikro = await this.entityManager.findOne(UserMikro, { id });

    if (!userMikro) {
      return null;
    }

    const user = UsersMapper.toDomain(userMikro);

    this.entityManager.remove(userMikro);
    await this.entityManager.flush();

    return user;
  }

  public async updateRole(user: User): Promise<void> {
    await this.entityManager.nativeUpdate(
      UserMikro,
      { id: user.getId() },
      {
        roleId: user.getRoleId(),
        updatedAt: new Date(),
      },
    );
  }
}

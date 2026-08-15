import { Injectable } from '@nestjs/common';
import { IUsersCommandRepository } from '../../domain/repositories/users-command.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../domain/user.aggregate';
import { User as UserMikro } from '../entities/user.entity';

@Injectable()
export class MikroUsersCommandRepository implements IUsersCommandRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async create(user: User): Promise<void> {
    const userMikro = this.entityManager.create(UserMikro, {
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      password: user.getPassword(),
    });

    this.entityManager.persist(userMikro);

    await this.entityManager.flush();
  }
}

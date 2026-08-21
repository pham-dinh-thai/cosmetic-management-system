import { Injectable } from '@nestjs/common';
import { IAuthUsersQueryRepository } from '../../domain/repositories/auth-users-query.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { AuthUserReadModel } from '../../domain/read-models/auth-user.read-model';
import { AuthUser as AuthUserMikro } from '../entities/auth-user.entity';

@Injectable()
export class MikroAuthUsersQueryRepository implements IAuthUsersQueryRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findByUserId(userId: string): Promise<AuthUserReadModel | null> {
    const user = await this.entityManager.findOne(AuthUserMikro, { userId });

    return user
      ? new AuthUserReadModel(user.id, user.userId, user.password)
      : null;
  }
}

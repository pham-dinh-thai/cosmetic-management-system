import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { CheckUserExistsPort } from '../../domain/services/check-user-exists.service';
import { User } from '../entities/user.entity';

@Injectable()
export class MikroCheckUserExistsAdapter implements CheckUserExistsPort {
  public constructor(private readonly entityManager: EntityManager) {}

  public async isEmailTaken(email: string): Promise<boolean> {
    return !!(await this.entityManager.findOne(User, { email }));
  }
}

import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../repositories/users-query.repository';
import { EmailAlreadyTakenException } from '../exceptions/email-already-taken.exception';

@Injectable()
export class UserUniquenessService {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly usersQueryRepository: IUsersQueryRepository,
  ) {}

  public async ensureEmailIsUnique(email: string): Promise<void> {
    if (await this.usersQueryRepository.findByEmail(email)) {
      throw new EmailAlreadyTakenException(email);
    }
  }
}

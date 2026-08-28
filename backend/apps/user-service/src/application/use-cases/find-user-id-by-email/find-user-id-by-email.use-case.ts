import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';
import { FindUserIdByEmailResponse } from './find-user-id-by-email.response';

@Injectable()
export class FindUserIdByEmailUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(
    email: string,
  ): Promise<FindUserIdByEmailResponse | null> {
    const user = await this.usersRepository.findByEmail(email);

    return user
      ? new FindUserIdByEmailResponse(user.getId(), user.getRoleId())
      : null;
  }
}

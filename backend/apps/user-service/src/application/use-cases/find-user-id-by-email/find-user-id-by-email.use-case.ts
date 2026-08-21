import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../domain/repositories/users-query.repository';
import { FindUserIdByEmailResponse } from './find-user-id-by-email.response';

@Injectable()
export class FindUserIdByEmailUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly usersQueryRepository: IUsersQueryRepository,
  ) {}

  public async execute(email: string): Promise<FindUserIdByEmailResponse> {
    const user = await this.usersQueryRepository.findByEmail(email);

    return new FindUserIdByEmailResponse(user?.id);
  }
}

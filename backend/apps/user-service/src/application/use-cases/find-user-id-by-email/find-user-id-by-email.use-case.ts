import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../domain/repositories/users-query.repository';

@Injectable()
export class FindUserIdByEmailUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly usersQueryRepository: IUsersQueryRepository,
  ) {}

  public async execute(
    email: string,
  ): Promise<{ id?: string; roleId?: string }> {
    const user = await this.usersQueryRepository.findByEmail(email);

    return { id: user?.id, roleId: user?.roleId };
  }
}

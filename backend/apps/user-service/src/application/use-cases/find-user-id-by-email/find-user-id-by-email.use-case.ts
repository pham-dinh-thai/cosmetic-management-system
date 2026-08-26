import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';

@Injectable()
export class FindUserIdByEmailUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(
    email: string,
  ): Promise<{ id?: string; roleId?: string }> {
    const user = await this.usersRepository.findByEmail(email);

    return { id: user?.id, roleId: user?.roleId };
  }
}

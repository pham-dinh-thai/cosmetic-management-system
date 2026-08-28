import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';
import { FindUserByIdResponse } from './find-user-by-id.response';

@Injectable()
export class FindUserByIdUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<FindUserByIdResponse | null> {
    const user = await this.usersRepository.findById(id);

    return user
      ? new FindUserByIdResponse(
          user.getId(),
          user.getFirstName(),
          user.getLastName(),
          user.getGender(),
          user.getEmail(),
          user.getRoleId(),
        )
      : null;
  }
}

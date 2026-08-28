import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateUserInformationRequest } from './update-user-information.request';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';

@Injectable()
export class UpdateUserInformationUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateUserInformationRequest,
  ): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    user.updateInformation({
      firstName: request.firstName,
      lastName: request.lastName,
      gender: request.gender,
    });

    await this.usersRepository.updateInformation(user);
  }
}

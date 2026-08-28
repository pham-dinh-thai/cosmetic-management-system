import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';
import { UserReadModel } from './read-model/user.read-model';

@Injectable()
export class FindUsersUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<UserReadModel[]> {
    const users = await this.usersRepository.findAll();

    return users.map(
      (user) =>
        new UserReadModel(
          user.getId(),
          user.getFirstName(),
          user.getLastName(),
          user.getGender(),
          user.getEmail(),
          user.getRoleId(),
        ),
    );
  }
}

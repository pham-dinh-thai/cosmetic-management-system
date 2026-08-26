import { Inject, Injectable } from '@nestjs/common';
import { UserReadModel } from '../../../domain/read-models/user.read-model';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';

@Injectable()
export class FindUsersUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<UserReadModel[]> {
    const users = await this.usersRepository.findAll();

    return users;
  }
}

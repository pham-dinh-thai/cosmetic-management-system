import { Inject, Injectable } from '@nestjs/common';
import { UserReadModel } from '../../../domain/read-models/user.read-model';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';

@Injectable()
export class FindUserByIdUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<UserReadModel | null> {
    const users = await this.usersRepository.findById(id);

    return users;
  }
}

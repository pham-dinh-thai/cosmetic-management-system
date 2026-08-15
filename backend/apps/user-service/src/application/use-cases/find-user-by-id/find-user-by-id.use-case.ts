import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../domain/repositories/users-query.repository';
import { UserReadModel } from '../../../domain/read-models/user.read-model';

@Injectable()
export class FindUserByIdUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly usersQueryRepository: IUsersQueryRepository,
  ) {}

  public async execute(id: string): Promise<UserReadModel | null> {
    const users = await this.usersQueryRepository.findById(id);

    return users;
  }
}

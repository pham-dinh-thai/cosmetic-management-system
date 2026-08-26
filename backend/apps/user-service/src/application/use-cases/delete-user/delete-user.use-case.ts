import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';

@Injectable()
export class DeleteUserUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}

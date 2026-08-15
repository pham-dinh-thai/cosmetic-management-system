import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../domain/repositories/users-command.repository';

@Injectable()
export class DeleteUserUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.usersCommandRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}

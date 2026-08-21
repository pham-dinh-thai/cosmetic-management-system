import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  AUTH_USERS_COMMAND_REPOSITORY,
  type IAuthUsersCommandRepository,
} from '../repositories/auth-users-command.repository';

@Injectable()
export class EnsureAuthUserDoesNotExistService {
  public constructor(
    @Inject(AUTH_USERS_COMMAND_REPOSITORY)
    private readonly authUsersCommandRepository: IAuthUsersCommandRepository,
  ) {}

  public async byUserId(userId: string): Promise<void> {
    const exists = await this.authUsersCommandRepository.existsByUserId(userId);

    if (exists) {
      throw new ConflictException(
        `Auth user for userId ${userId} already exists`,
      );
    }
  }
}

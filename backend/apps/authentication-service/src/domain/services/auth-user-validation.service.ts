import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUserReaderPort,
  USER_READER_PORT,
} from '../ports/user-reader.port';
import {
  type IAuthUsersCommandRepository,
  AUTH_USERS_COMMAND_REPOSITORY,
} from '../repositories/auth-users-command.repository';

@Injectable()
export class AuthUserValidationService {
  public constructor(
    @Inject(USER_READER_PORT)
    private readonly userReaderPort: IUserReaderPort,

    @Inject(AUTH_USERS_COMMAND_REPOSITORY)
    private readonly authUsersCommandRepository: IAuthUsersCommandRepository,
  ) {}

  public async ensureUserExists(userId: string): Promise<void> {
    const user = await this.userReaderPort.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  public async ensureAuthUserDoesNotExist(userId: string): Promise<void> {
    const exists =
      await this.authUsersCommandRepository.existsByUserId(userId);

    if (exists) {
      throw new ConflictException(
        `Auth user for userId ${userId} already exists`,
      );
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import {
  CREATE_AUTH_USER_ID_PORT,
  type ICreateAuthUserIdPort,
} from '../../ports/create-auth-user-id.port';
import {
  type IPasswordHasherPort,
  PASSWORD_HASHER_PORT,
} from '../../ports/password-hasher.port';
import { AuthUser } from '../../../domain/auth-user.aggregate';
import {
  AUTH_USERS_COMMAND_REPOSITORY,
  type IAuthUsersCommandRepository,
} from '../../../domain/repositories/auth-users-command.repository';
import { ICreateAuthUserRequest } from './create-auth-user.request';

@Injectable()
export class CreateAuthUserUseCase {
  public constructor(
    @Inject(AUTH_USERS_COMMAND_REPOSITORY)
    private readonly authUsersCommandRepository: IAuthUsersCommandRepository,

    @Inject(CREATE_AUTH_USER_ID_PORT)
    private readonly createAuthUserIdPort: ICreateAuthUserIdPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasherPort: IPasswordHasherPort,
  ) {}

  public async execute(request: ICreateAuthUserRequest): Promise<void> {
    const id = this.createAuthUserIdPort.generate();
    const hashed = await this.passwordHasherPort.hash(request.password, 10);

    const authUser = AuthUser.create({
      id,
      userId: request.userId,
      password: hashed,
    });

    await this.authUsersCommandRepository.create(authUser);
  }
}

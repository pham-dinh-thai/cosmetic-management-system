import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../domain/repositories/users-command.repository';
import { ICreateUserRequest } from './create-user.request';
import { User } from '../../../domain/user.aggregate';
import {
  CREATE_USER_ID_PORT,
  type CreateUserIdPort,
} from '../../ports/create-user-id.port';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../../../domain/services/password-hasher.service';
import {
  CHECK_USER_EXISTS,
  type CheckUserExistsPort,
} from '../../../domain/services/check-user-exists.service';

@Injectable()
export class CreateUserUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,

    @Inject(CREATE_USER_ID_PORT)
    private readonly createUserIdPort: CreateUserIdPort,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    @Inject(CHECK_USER_EXISTS)
    private readonly checkUserExists: CheckUserExistsPort,
  ) {}

  public async execute(request: ICreateUserRequest): Promise<void> {
    if (await this.checkUserExists.isEmailTaken(request.email)) {
      throw new ConflictException('Email already in use');
    }

    const id = this.createUserIdPort.generate();
    const password = await this.passwordHasher.hash(request.password);

    const user = User.create({
      id,
      email: request.email,
      name: request.name,
      password,
    });

    await this.usersCommandRepository.create(user);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersCommandRepository,
  USERS_COMMAND_REPOSITORY,
} from '../../../domain/repositories/users-command.repository';
import { ICreateUserRequest } from './create-user.request';
import { User } from '../../../domain/user.aggregate';
import {
  CREATE_USER_ID_PORT,
  type ICreateUserIdPort,
} from '../../ports/create-user-id.port';
import {
  PASSWORD_HASHER_PORT,
  type IPasswordHasherPort,
} from '../../ports/password-hasher.port';
import { UserUniquenessService } from '../../../domain/services/user-uniqueness.service';

@Injectable()
export class CreateUserUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,

    @Inject(CREATE_USER_ID_PORT)
    private readonly createUserIdPort: ICreateUserIdPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasherPort: IPasswordHasherPort,

    private readonly userUniquenessService: UserUniquenessService,
  ) {}

  public async execute(request: ICreateUserRequest): Promise<void> {
    await this.userUniquenessService.ensureEmailIsUnique(request.email);

    const id = this.createUserIdPort.generate();
    const password = await this.passwordHasherPort.hash(request.password);

    const user = User.create({
      id,
      email: request.email,
      name: request.name,
      password,
    });

    await this.usersCommandRepository.create(user);
  }
}

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
import { UserUniquenessService } from '../../../domain/services/user-uniqueness.service';
import { CreateUserResponse } from './create-user.response';

@Injectable()
export class CreateUserUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,

    @Inject(CREATE_USER_ID_PORT)
    private readonly createUserIdPort: ICreateUserIdPort,

    private readonly userUniquenessService: UserUniquenessService,
  ) {}

  public async execute(
    request: ICreateUserRequest,
  ): Promise<CreateUserResponse> {
    await this.userUniquenessService.ensureEmailIsUnique(request.email);

    const id = this.createUserIdPort.generate();

    const user = User.create({
      id,
      firstName: request.firstName,
      lastName: request.lastName,
      gender: request.gender,
      phone: request.phone,
      email: request.email,
      roleId: request.roleId,
    });

    await this.usersCommandRepository.create(user);

    return new CreateUserResponse(user.getId());
  }
}

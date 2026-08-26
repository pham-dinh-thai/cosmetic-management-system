import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ICreateUserRequest } from './create-user.request';
import { User } from '../../../domain/user.aggregate';
import { UserUniquenessService } from '../../../domain/services/user-uniqueness.service';
import { EmailAlreadyExistsException } from '../../../domain/exceptions/email-already-exists.exception';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from 'apps/user-service/src/domain/repositories/users.repository';
import {
  CREATE_AUTH_USER_PORT,
  type ICreateAuthUserPort,
} from '../../ports/create-auth-user.port';

@Injectable()
export class CreateUserUseCase {
  public constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,

    @Inject(CREATE_AUTH_USER_PORT)
    private readonly createAuthUserPort: ICreateAuthUserPort,

    private readonly userUniquenessService: UserUniquenessService,
  ) {}

  public async execute(request: ICreateUserRequest): Promise<{ id: string }> {
    try {
      await this.userUniquenessService.ensureEmailIsUnique(request.email);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }

    const user = User.create({
      firstName: request.firstName,
      lastName: request.lastName,
      gender: request.gender,
      email: request.email,
      roleId: request.roleId,
    });

    const created = await this.usersRepository.create(user);

    await this.createAuthUserPort.execute({
      userId: created.id,
      password: request.password,
    });

    return { id: created.id };
  }
}

import { AuthUser } from '../../../domain/auth-user.aggregate';
import { ICreateAuthUserRequest } from './create-auth-user.request';
import { UserNotFoundException } from 'apps/authentication-service/src/domain/exceptions/user-not-found.exception';
import { AuthUserAlreadyExistsException } from 'apps/authentication-service/src/domain/exceptions/auth-user-already-exists.exception';
import { IFindUserByIdPort } from '../../ports/find-user-by-id.port';
import { IAuthUsersRepository } from 'apps/authentication-service/src/domain/repositories/auth-users.repository';

export class CreateAuthUserUseCase {
  public constructor(
    private readonly authUsersRepository: IAuthUsersRepository,
    private readonly findUserByIdPort: IFindUserByIdPort,
  ) {}

  public async execute(request: ICreateAuthUserRequest): Promise<void> {
    const user = await this.findUserByIdPort.execute(request.userId);

    if (!user) {
      throw new UserNotFoundException('userId', request.userId);
    }

    const exists = await this.authUsersRepository.findByUserId(user.id);

    if (exists) {
      throw new AuthUserAlreadyExistsException(user.id);
    }

    const authUser = await AuthUser.create({
      userId: request.userId,
      password: request.password,
    });

    await this.authUsersRepository.create(authUser);
  }
}

export const createAuthUserUseCaseFactory = (
  authUsersRepository: IAuthUsersRepository,
  findUserByIdPort: IFindUserByIdPort,
): CreateAuthUserUseCase =>
  new CreateAuthUserUseCase(authUsersRepository, findUserByIdPort);

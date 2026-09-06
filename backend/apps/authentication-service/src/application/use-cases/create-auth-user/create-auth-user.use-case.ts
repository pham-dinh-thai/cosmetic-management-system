import { type IPasswordHasherPort } from '../../ports/password-hasher.port';
import { AuthUser } from '../../../domain/auth-user.aggregate';
import { type IAuthUsersCommandRepository } from '../../../domain/repositories/auth-users-command.repository';
import { ICreateAuthUserRequest } from './create-auth-user.request';
import { IUsersReaderPort } from 'apps/authentication-service/src/application/ports/users-reader.port';
import { UserNotFoundException } from 'apps/authentication-service/src/domain/exceptions/user-not-found.exception';
import { AuthUserAlreadyExistsException } from 'apps/authentication-service/src/domain/exceptions/auth-user-already-exists.exception';

export class CreateAuthUserUseCase {
  public constructor(
    private readonly authUsersCommandRepository: IAuthUsersCommandRepository,
    private readonly passwordHasherPort: IPasswordHasherPort,
    private readonly usersReaderPort: IUsersReaderPort,
  ) {}

  public async execute(request: ICreateAuthUserRequest): Promise<void> {
    const user = await this.usersReaderPort.findById(request.userId);

    if (!user) {
      throw new UserNotFoundException('userId', request.userId);
    }

    const exists = await this.authUsersCommandRepository.existsByUserId(
      user.id,
    );

    if (exists) {
      throw new AuthUserAlreadyExistsException(user.id);
    }

    const hashed = await this.passwordHasherPort.hash(request.password, 10);

    const authUser = AuthUser.create({
      userId: request.userId,
      password: hashed,
    });

    await this.authUsersCommandRepository.create(authUser);
  }
}

export const createAuthUserUseCaseFactory = (
  authUsersCommandRepository: IAuthUsersCommandRepository,
  passwordHasherPort: IPasswordHasherPort,
  usersReaderPort: IUsersReaderPort,
): CreateAuthUserUseCase =>
  new CreateAuthUserUseCase(
    authUsersCommandRepository,
    passwordHasherPort,
    usersReaderPort,
  );

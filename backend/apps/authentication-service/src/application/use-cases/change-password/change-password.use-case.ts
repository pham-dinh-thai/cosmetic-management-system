import { AuthUser } from '../../../domain/auth-user.aggregate';
import { IAuthUsersCommandRepository } from '../../../domain/repositories/auth-users-command.repository';
import { IAuthUsersQueryRepository } from '../../../domain/repositories/auth-users-query.repository';
import { InvalidCredentialsException } from '../../../domain/exceptions/invalid-credentials.exception';
import { IPasswordHasherPort } from '../../ports/password-hasher.port';
import { IChangePasswordRequest } from './change-password.request';

export class ChangePasswordUseCase {
  public constructor(
    private readonly authUsersQueryRepository: IAuthUsersQueryRepository,
    private readonly authUsersCommandRepository: IAuthUsersCommandRepository,
    private readonly passwordHasherPort: IPasswordHasherPort,
  ) {}

  public async execute(request: IChangePasswordRequest): Promise<void> {
    const authUser = await this.authUsersQueryRepository.findByUserId(
      request.userId,
    );

    if (!authUser) {
      throw new InvalidCredentialsException();
    }

    const currentPasswordMatches = await this.passwordHasherPort.compare(
      request.currentPassword,
      authUser.password,
    );

    if (!currentPasswordMatches) {
      throw new InvalidCredentialsException();
    }

    const hashedPassword = await this.passwordHasherPort.hash(
      request.newPassword,
      10,
    );

    const updated = AuthUser.create({
      userId: request.userId,
      password: hashedPassword,
    });

    await this.authUsersCommandRepository.update(updated);
  }
}

export const changePasswordUseCaseFactory = (
  authUsersQueryRepository: IAuthUsersQueryRepository,
  authUsersCommandRepository: IAuthUsersCommandRepository,
  passwordHasherPort: IPasswordHasherPort,
): ChangePasswordUseCase =>
  new ChangePasswordUseCase(
    authUsersQueryRepository,
    authUsersCommandRepository,
    passwordHasherPort,
  );

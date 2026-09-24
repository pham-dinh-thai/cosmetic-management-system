import { AuthUserNotFoundException } from 'apps/authentication-service/src/domain/exceptions/auth-user-not-found.exception';
import { IChangePasswordRequest } from './change-password.request';
import { IAuthUsersRepository } from 'apps/authentication-service/src/domain/repositories/auth-users.repository';

export class ChangePasswordUseCase {
  public constructor(
    private readonly authUsersRepository: IAuthUsersRepository,
  ) {}

  public async execute(
    userId: string,
    request: IChangePasswordRequest,
  ): Promise<void> {
    const authUser = await this.authUsersRepository.findByUserId(userId);

    if (!authUser) {
      throw new AuthUserNotFoundException(userId);
    }

    await authUser.changePassword(
      request.currentPassword,
      request.newPassword,
      request.newPasswordConfirmation,
    );

    await this.authUsersRepository.changePassword(authUser);
  }
}

export const changePasswordUseCaseFactory = (
  authUsersRepository: IAuthUsersRepository,
): ChangePasswordUseCase => new ChangePasswordUseCase(authUsersRepository);

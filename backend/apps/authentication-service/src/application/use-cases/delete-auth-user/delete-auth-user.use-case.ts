import { AuthUserNotFoundException } from 'apps/authentication-service/src/domain/exceptions/auth-user-not-found.exception';
import { IAuthUsersRepository } from 'apps/authentication-service/src/domain/repositories/auth-users.repository';

export class DeleteAuthUserUseCase {
  public constructor(
    private readonly authUsersRepository: IAuthUsersRepository,
  ) {}

  public async execute(userId: string): Promise<void> {
    const deleted = await this.authUsersRepository.deleteByUserId(userId);

    if (!deleted) {
      throw new AuthUserNotFoundException(userId);
    }
  }
}

export const deleteAuthUserUseCaseFactory = (
  authUsersRepository: IAuthUsersRepository,
): DeleteAuthUserUseCase => new DeleteAuthUserUseCase(authUsersRepository);

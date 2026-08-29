import { type IAuthUsersCommandRepository } from '../repositories/auth-users-command.repository';
import { AuthUserAlreadyExistsException } from '../exceptions/auth-user-already-exists.exception';

export class EnsureAuthUserDoesNotExistService {
  public constructor(
    private readonly authUsersCommandRepository: IAuthUsersCommandRepository,
  ) {}

  public async byUserId(userId: string): Promise<void> {
    const exists = await this.authUsersCommandRepository.existsByUserId(userId);

    if (exists) {
      throw new AuthUserAlreadyExistsException(userId);
    }
  }
}

export const ensureAuthUserDoesNotExistServiceFactory = (
  authUsersCommandRepository: IAuthUsersCommandRepository,
): EnsureAuthUserDoesNotExistService =>
  new EnsureAuthUserDoesNotExistService(authUsersCommandRepository);

import { type IPasswordHasherPort } from '../../ports/password-hasher.port';
import { AuthUser } from '../../../domain/auth-user.aggregate';
import { type IAuthUsersCommandRepository } from '../../../domain/repositories/auth-users-command.repository';
import { ICreateAuthUserRequest } from './create-auth-user.request';
import { EnsureUserExistsService } from '../../../domain/services/ensure-user-exists.service';
import { EnsureAuthUserDoesNotExistService } from '../../../domain/services/ensure-auth-user-does-not-exist.service';

export class CreateAuthUserUseCase {
  public constructor(
    private readonly authUsersCommandRepository: IAuthUsersCommandRepository,
    private readonly passwordHasherPort: IPasswordHasherPort,
    private readonly ensureUserExistsService: EnsureUserExistsService,
    private readonly ensureAuthUserDoesNotExistService: EnsureAuthUserDoesNotExistService,
  ) {}

  public async execute(request: ICreateAuthUserRequest): Promise<void> {
    await this.ensureUserExistsService.byUserId(request.userId);
    await this.ensureAuthUserDoesNotExistService.byUserId(request.userId);

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
  ensureUserExistsService: EnsureUserExistsService,
  ensureAuthUserDoesNotExistService: EnsureAuthUserDoesNotExistService,
): CreateAuthUserUseCase =>
  new CreateAuthUserUseCase(
    authUsersCommandRepository,
    passwordHasherPort,
    ensureUserExistsService,
    ensureAuthUserDoesNotExistService,
  );

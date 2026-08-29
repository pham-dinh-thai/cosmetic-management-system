import { type IUsersReaderPort } from '../../../domain/ports/users-reader.port';
import { type IPasswordHasherPort } from '../../ports/password-hasher.port';
import { type IAuthUsersQueryRepository } from '../../../domain/repositories/auth-users-query.repository';
import { ILoginRequest } from './login.request';
import { type ISignTokenPort } from '../../ports/sign-token.port';
import { LoginResponse } from './login.response';
import { InvalidCredentialsException } from 'apps/authentication-service/src/domain/exceptions/invalid-credentials.exception';

export class LoginUseCase {
  public constructor(
    private readonly usersReaderPort: IUsersReaderPort,
    private readonly passwordHasherPort: IPasswordHasherPort,
    private readonly authUsersQueryRepository: IAuthUsersQueryRepository,
    private readonly signTokenPort: ISignTokenPort,
  ) {}

  public async execute(request: ILoginRequest): Promise<LoginResponse> {
    const user = await this.usersReaderPort.findByEmail(request.email);

    if (!user?.id) {
      throw new InvalidCredentialsException();
    }

    const authUser = await this.authUsersQueryRepository.findByUserId(user.id);
    if (!authUser) {
      throw new InvalidCredentialsException();
    }

    if (
      !(await this.passwordHasherPort.compare(
        request.password,
        authUser.password,
      ))
    ) {
      throw new InvalidCredentialsException();
    }

    return new LoginResponse(
      this.signTokenPort.signAccessToken({
        sub: user.id,
        email: request.email,
        roleId: user.roleId,
      }),
      this.signTokenPort.signRefreshToken({ sub: user.id }),
    );
  }
}

export const loginUseCaseFactory = (
  usersReaderPort: IUsersReaderPort,
  passwordHasherPort: IPasswordHasherPort,
  authUsersQueryRepository: IAuthUsersQueryRepository,
  signTokenPort: ISignTokenPort,
): LoginUseCase =>
  new LoginUseCase(
    usersReaderPort,
    passwordHasherPort,
    authUsersQueryRepository,
    signTokenPort,
  );

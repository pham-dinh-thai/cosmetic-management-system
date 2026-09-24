import { ILoginRequest } from './login.request';
import { ISignTokenPort } from '../../ports/sign-token.port';
import { LoginResponse } from './login.response';
import { InvalidCredentialsException } from 'apps/authentication-service/src/domain/exceptions/invalid-credentials.exception';
import { UserDeactivatedException } from 'apps/authentication-service/src/domain/exceptions/user-deactivated.exception';
import { IFindUserByEmailPort } from '../../ports/find-user-by-email.port';
import { IAuthUsersRepository } from 'apps/authentication-service/src/domain/repositories/auth-users.repository';
import { PermissionResolver } from '../../services/permission.resolver';

export class LoginUseCase {
  public constructor(
    private readonly findUserByEmailPort: IFindUserByEmailPort,
    private readonly authUsersRepository: IAuthUsersRepository,
    private readonly signTokenPort: ISignTokenPort,
    private readonly permissionResolver: PermissionResolver,
  ) {}

  public async execute(request: ILoginRequest): Promise<LoginResponse> {
    const user = await this.findUserByEmailPort.execute(request.email);

    if (!user?.id) {
      throw new InvalidCredentialsException();
    }

    if (!user.isActive) {
      throw new UserDeactivatedException();
    }

    const authUser = await this.authUsersRepository.findByUserId(user.id);
    if (!authUser) {
      throw new InvalidCredentialsException();
    }

    const isMatchedWithCurrentPassword = await authUser.comparePassword(
      request.password,
    );
    if (!isMatchedWithCurrentPassword) {
      throw new InvalidCredentialsException();
    }

    const permission = await this.permissionResolver.load(user.id);

    return new LoginResponse(
      this.signTokenPort.signAccessToken({
        sub: user.id,
        email: request.email,
        roleId: user.roleId,
        departmentCode: permission?.departmentCode,
        position: permission?.position,
      }),
      this.signTokenPort.signRefreshToken({ sub: user.id }),
    );
  }
}

export const loginUseCaseFactory = (
  findUserByEmailPort: IFindUserByEmailPort,
  authUsersRepository: IAuthUsersRepository,
  signTokenPort: ISignTokenPort,
  permissionResolver: PermissionResolver,
): LoginUseCase =>
  new LoginUseCase(
    findUserByEmailPort,
    authUsersRepository,
    signTokenPort,
    permissionResolver,
  );

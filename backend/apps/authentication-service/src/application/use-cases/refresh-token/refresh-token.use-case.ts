import { type ISignTokenPort } from '../../ports/sign-token.port';
import { type IUsersReaderPort } from '../../ports/users-reader.port';
import { LoginResponse } from '../login/login.response';
import { InvalidRefreshTokenException } from '../../../domain/exceptions/invalid-refresh-token.exception';
import { UserDeactivatedException } from 'apps/authentication-service/src/domain/exceptions/user-deactivated.exception';
import { PermissionResolver } from '../../services/permission.resolver';

export class RefreshTokenUseCase {
  public constructor(
    private readonly signTokenPort: ISignTokenPort,
    private readonly usersReaderPort: IUsersReaderPort,
    private readonly permissionResolver: PermissionResolver,
  ) {}

  public async execute(refreshToken: string): Promise<LoginResponse> {
    const payload = await this.signTokenPort.verifyRefreshToken(refreshToken);

    if (!payload?.sub) {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.usersReaderPort.findById(payload.sub);

    if (!user) {
      throw new InvalidRefreshTokenException();
    }

    if (!user.isActive) {
      throw new UserDeactivatedException();
    }

    const permission = await this.permissionResolver.load(user.id);

    return new LoginResponse(
      this.signTokenPort.signAccessToken({
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
        departmentCode: permission?.departmentCode,
        position: permission?.position,
      }),
      this.signTokenPort.signRefreshToken({ sub: user.id }),
    );
  }
}

export const refreshTokenUseCaseFactory = (
  signTokenPort: ISignTokenPort,
  usersReaderPort: IUsersReaderPort,
  permissionResolver: PermissionResolver,
): RefreshTokenUseCase =>
  new RefreshTokenUseCase(signTokenPort, usersReaderPort, permissionResolver);

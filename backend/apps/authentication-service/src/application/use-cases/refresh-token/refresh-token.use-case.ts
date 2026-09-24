import { type ISignTokenPort } from '../../ports/sign-token.port';
import { InvalidRefreshTokenException } from '../../../domain/exceptions/invalid-refresh-token.exception';
import { UserDeactivatedException } from 'apps/authentication-service/src/domain/exceptions/user-deactivated.exception';
import { PermissionResolver } from '../../services/permission.resolver';
import { IFindUserByIdPort } from '../../ports/find-user-by-id.port';
import { IRolePermissionReaderPort } from '../../ports/role-permission-reader.port';

export class RefreshTokenResponse {
  public constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}

export class RefreshTokenUseCase {
  public constructor(
    private readonly signTokenPort: ISignTokenPort,
    private readonly findUserByIdPort: IFindUserByIdPort,
    private readonly permissionResolver: PermissionResolver,
    private readonly rolePermissionReaderPort: IRolePermissionReaderPort,
  ) {}

  public async execute(refreshToken: string): Promise<RefreshTokenResponse> {
    const payload = await this.signTokenPort.verifyRefreshToken(refreshToken);

    if (!payload?.sub) {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.findUserByIdPort.execute(payload.sub);

    if (!user) {
      throw new InvalidRefreshTokenException();
    }

    if (!user.isActive) {
      throw new UserDeactivatedException();
    }

    const permission = await this.permissionResolver.load(user.id);
    const permissions = await this.rolePermissionReaderPort.findByRoleId(
      user.roleId,
    );

    return new RefreshTokenResponse(
      this.signTokenPort.signAccessToken({
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
        departmentCode: permission?.departmentCode,
        position: permission?.position,
        permissions,
      }),
      this.signTokenPort.signRefreshToken({ sub: user.id }),
    );
  }
}

export const refreshTokenUseCaseFactory = (
  signTokenPort: ISignTokenPort,
  findUserByIdPort: IFindUserByIdPort,
  permissionResolver: PermissionResolver,
  rolePermissionReaderPort: IRolePermissionReaderPort,
): RefreshTokenUseCase =>
  new RefreshTokenUseCase(
    signTokenPort,
    findUserByIdPort,
    permissionResolver,
    rolePermissionReaderPort,
  );

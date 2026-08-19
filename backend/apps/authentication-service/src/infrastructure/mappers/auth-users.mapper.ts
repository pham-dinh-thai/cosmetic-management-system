import { AuthUser } from '../../domain/auth-user.aggregate';
import { AuthUser as AuthUserMikro } from '../entities/auth-user.entity';

export class AuthUsersMapper {
  public static toMikro(authUser: AuthUser): AuthUserMikro {
    const authUserMikro = new AuthUserMikro();

    authUserMikro.id = authUser.getId();
    authUserMikro.userId = authUser.getUserId();
    authUserMikro.password = authUser.getPassword();

    return authUserMikro;
  }
}

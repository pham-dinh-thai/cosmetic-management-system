import { User } from '../../domain/user.aggregate';
import { User as UserMikro } from '../entities/user.entity';

export class UsersMapper {
  public static toDomain(userMikro: UserMikro): User {
    return User.fromPersistent({
      id: userMikro.id,
      firstName: userMikro.firstName,
      lastName: userMikro.lastName,
      gender: userMikro.gender,
      email: userMikro.email,
      roleId: userMikro.roleId,
    });
  }

  public static toMikro(user: User): UserMikro {
    const userMikro = new UserMikro();

    userMikro.id = user.getId();
    userMikro.firstName = user.getFirstName();
    userMikro.lastName = user.getLastName();
    userMikro.gender = user.getGender();
    userMikro.email = user.getEmail();
    userMikro.roleId = user.getRoleId();

    return userMikro;
  }
}

import { UserReadModel } from '../../domain/read-models/user.read-model';
import { User } from '../../domain/user.aggregate';
import { User as UserMikro } from '../entities/user.entity';

export class UsersMapper {
  public static toMikro(user: User): UserMikro {
    const userMikro = new UserMikro();

    userMikro.id = user.getId();
    userMikro.firstName = user.getFirstName();
    userMikro.lastName = user.getLastName();
    userMikro.gender = user.getGender();
    userMikro.phone = user.getPhone();
    userMikro.email = user.getEmail();
    userMikro.roleId = user.getRoleId();

    return userMikro;
  }

  public static toReadModel(userMikro: UserMikro): UserReadModel {
    return new UserReadModel(
      userMikro.id,
      userMikro.firstName,
      userMikro.lastName,
      userMikro.gender,
      userMikro.phone,
      userMikro.email,
      userMikro.roleId,
    );
  }
}

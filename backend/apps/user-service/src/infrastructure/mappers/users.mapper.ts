import { UserReadModel } from '../../domain/read-models/user.read-model';
import { User } from '../../domain/user.aggregate';
import { User as UserMikro } from '../entities/user.entity';

export class UsersMapper {
  public static toMikro(user: User): UserMikro {
    const userMikro = new UserMikro();

    userMikro.id = user.getId();
    userMikro.email = user.getEmail();
    userMikro.name = user.getName();
    userMikro.password = user.getPassword();

    return userMikro;
  }

  public static toReadModel(userMikro: UserMikro): UserReadModel {
    return new UserReadModel(userMikro.id, userMikro.email, userMikro.name);
  }
}

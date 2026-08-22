import { RoleReadModel } from '../../domain/read-models/role.read-model';
import { Role } from '../../domain/role.aggregate';
import { Role as RoleMikro } from '../entities/role.entity';

export class RolesMapper {
  public static toMikro(role: Role): RoleMikro {
    const roleMikro = new RoleMikro();

    roleMikro.id = role.getId();
    roleMikro.name = role.getName();

    return roleMikro;
  }

  public static toReadModel(roleMikro: RoleMikro): RoleReadModel {
    return new RoleReadModel(roleMikro.id, roleMikro.name);
  }
}

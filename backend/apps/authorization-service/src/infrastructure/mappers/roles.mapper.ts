import { Role } from '../../domain/role.aggregate';
import { Role as RoleMikro } from '../entities/role.entity';

export class RolesMapper {
  public static toDomain(roleMikro: RoleMikro): Role {
    return Role.fromPersistent(roleMikro.id, roleMikro.name);
  }

  public static toMikro(role: Role): RoleMikro {
    const roleMikro = new RoleMikro();

    roleMikro.id = role.getId();
    roleMikro.name = role.getName();

    return roleMikro;
  }
}

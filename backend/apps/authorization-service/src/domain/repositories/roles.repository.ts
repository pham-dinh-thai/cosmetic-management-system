import { RoleReadModel } from '../read-models/role.read-model';
import { Role } from '../role.aggregate';

export interface IRolesRepository {
  findAll(): Promise<RoleReadModel[]>;

  create(role: Role): Promise<void>;

  delete(id: string): Promise<boolean>;
}

export const ROLES_REPOSITORY = 'IRolesRepository';

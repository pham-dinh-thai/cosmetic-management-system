import { Role } from '../role.aggregate';

export interface IRolesRepository {
  findAll(): Promise<Role[]>;

  findById(id: string): Promise<Role | null>;

  create(role: Role): Promise<void>;

  delete(id: string): Promise<boolean>;
}

export const ROLES_REPOSITORY = 'IRolesRepository';

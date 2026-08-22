import { Role } from './role.aggregate';

export interface IRolesRepository {
  create(role: Role): Promise<void>;
}

export const ROLES_REPOSITORY = 'IRolesRepository';

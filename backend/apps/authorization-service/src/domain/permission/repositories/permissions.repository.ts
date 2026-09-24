import { Permission } from '../permission.aggregate';

export interface IPermissionsRepository {
  findAll(): Promise<Permission[]>;

  findById(id: string): Promise<Permission | null>;

  create(permission: Permission): Promise<void>;

  setIsActive(permission: Permission): Promise<void>;
}

export const PERMISSIONS_REPOSITORY = 'IPermissionsRepository';

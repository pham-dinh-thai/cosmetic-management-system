import { AuthUser } from '../auth-user.aggregate';

export interface IAuthUsersRepository {
  findByUserId(userId: string): Promise<AuthUser | null>;

  create(authUser: AuthUser): Promise<void>;

  changePassword(authUser: AuthUser): Promise<void>;

  deleteByUserId(userId: string): Promise<boolean>;
}

export const AUTH_USERS_REPOSITORY = 'IAuthUsersRepository';

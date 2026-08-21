import { AuthUser } from '../auth-user.aggregate';

export interface IAuthUsersCommandRepository {
  create(authUser: AuthUser): Promise<void>;

  existsByUserId(userId: string): Promise<boolean>;
}

export const AUTH_USERS_COMMAND_REPOSITORY = 'IAuthUserCommandRepository';

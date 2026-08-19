import { AuthUser } from '../auth-user.aggregate';

export interface IAuthUsersCommandRepository {
  create(authUser: AuthUser): Promise<void>;
}

export const AUTH_USERS_COMMAND_REPOSITORY = 'IAuthUserCommandRepository';

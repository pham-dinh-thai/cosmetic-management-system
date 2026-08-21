import { AuthUserReadModel } from '../read-models/auth-user.read-model';

export interface IAuthUsersQueryRepository {
  findByUserId(userId: string): Promise<AuthUserReadModel | null>;
}

export const AUTH_USERS_QUERY_REPOSITORY = 'IAuthUsersQueryRepository';

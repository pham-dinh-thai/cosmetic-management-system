import { UserReadModel } from '../read-models/user.read-model';

export interface IUsersQueryRepository {
  findById(id: string): Promise<UserReadModel | null>;
}

export const USERS_QUERY_REPOSITORY = 'IUsersQueryRepository';

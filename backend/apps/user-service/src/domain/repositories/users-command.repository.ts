import { User } from '../user.aggregate';

export interface IUsersCommandRepository {
  create(user: User): Promise<void>;
}

export const USERS_COMMAND_REPOSITORY = 'IUsersCommandRepository';

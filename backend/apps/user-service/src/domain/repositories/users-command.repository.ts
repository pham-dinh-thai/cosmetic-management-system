import { User } from '../user.aggregate';

export interface IUsersCommandRepository {
  create(user: User): Promise<void>;

  delete(id: string): Promise<boolean>;
}

export const USERS_COMMAND_REPOSITORY = 'IUsersCommandRepository';

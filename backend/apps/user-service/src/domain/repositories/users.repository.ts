import { UserReadModel } from '../read-models/user.read-model';
import { User } from '../user.aggregate';

export interface IUsersRepository {
  findAll(): Promise<UserReadModel[]>;

  findById(id: string): Promise<UserReadModel | null>;

  findByEmail(email: string): Promise<UserReadModel | null>;

  create(user: User): Promise<{ id: string }>;

  delete(id: string): Promise<boolean>;
}

export const USERS_REPOSITORY = 'IUsersRepository';

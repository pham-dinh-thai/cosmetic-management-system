import { User } from '../user.aggregate';

export interface IUsersRepository {
  findAll(): Promise<User[]>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  create(user: User): Promise<{ id: string }>;

  updateInformation(user: User): Promise<void>;

  delete(id: string): Promise<User | null>;

  updateRole(user: User): Promise<void>;

  updateActiveStatus(user: User): Promise<void>;
}

export const USERS_REPOSITORY = 'IUsersRepository';

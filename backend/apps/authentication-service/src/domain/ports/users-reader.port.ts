import { UserReadModel } from '../read-models/user.read-model';

export interface IUsersReaderPort {
  findById(id: string): Promise<{ id: string } | null>;

  findByEmail(email: string): Promise<UserReadModel | null>;
}

export const USERS_READER_PORT = 'IUsersReaderPort';

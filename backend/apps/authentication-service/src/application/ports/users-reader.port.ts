import { UserReadModel } from '../../domain/read-models/user.read-model';
import { FindUserByIdReadModel } from '../../domain/read-models/user-by-id.read-model';

export interface IUsersReaderPort {
  findById(id: string): Promise<FindUserByIdReadModel | null>;

  findByEmail(email: string): Promise<UserReadModel | null>;
}

export const USERS_READER_PORT = 'IUsersReaderPort';

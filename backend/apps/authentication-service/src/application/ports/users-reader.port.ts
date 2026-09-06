import { UserReadModel } from '../../domain/read-models/user.read-model';

export class FindUserByIdReadModel {
  public constructor(public readonly id: string) {}
}

export interface IUsersReaderPort {
  findById(id: string): Promise<FindUserByIdReadModel | null>;

  findByEmail(email: string): Promise<UserReadModel | null>;
}

export const USERS_READER_PORT = 'IUsersReaderPort';

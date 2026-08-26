export interface IUsersReaderPort {
  findById(id: string): Promise<{ id: string } | null>;

  findByEmail(email: string): Promise<{ id: string; roleId: string } | null>;
}

export const USERS_READER_PORT = 'IUsersReaderPort';

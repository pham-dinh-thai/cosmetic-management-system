export interface IUserReaderPort {
  findById(id: string): Promise<{ id: string } | null>;

  findByEmail(email: string): Promise<{ id: string; roleId: string } | null>;
}

export const USER_READER_PORT = 'IUserReaderPort';

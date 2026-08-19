export interface IUserReaderPort {
  findById(id: string): Promise<{ id: string } | null>;
}

export const USER_READER_PORT = 'IUserReaderPort';

export interface IDepartmentsReaderPort {
  findById(id: string): Promise<{ id: string } | null>;
}

export const DEPARTMENTS_READER_PORT = 'IDepartmentsReaderPort';

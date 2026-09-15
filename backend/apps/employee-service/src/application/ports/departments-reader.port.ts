export interface IDepartmentsReaderPort {
  findById(id: string): Promise<{ id: string; managerId: string | null } | null>;
}

export const DEPARTMENTS_READER_PORT = 'IDepartmentsReaderPort';
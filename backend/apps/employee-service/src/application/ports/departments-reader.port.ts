export interface IDepartmentsReaderPort {
  findById(
    id: string,
  ): Promise<{
    id: string;
    managerId: string | null;
    isActive: boolean;
  } | null>;
}

export const DEPARTMENTS_READER_PORT = 'IDepartmentsReaderPort';
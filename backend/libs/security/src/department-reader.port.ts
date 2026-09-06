export type DepartmentReadable = {
  code: string;
  name: string;
  isActive: boolean;
};

export interface IDepartmentReaderPort {
  findById(id: string): Promise<DepartmentReadable | null>;
}

export const DEPARTMENT_READER_PORT = 'IDepartmentReaderPort';

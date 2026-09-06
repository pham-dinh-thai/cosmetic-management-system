export type DepartmentPermissionReadable = {
  code: string;
  isActive: boolean;
};

export interface IDepartmentPermissionReaderPort {
  findById(id: string): Promise<DepartmentPermissionReadable | null>;
}

export const DEPARTMENT_PERMISSION_READER_PORT =
  'IDepartmentPermissionReaderPort';

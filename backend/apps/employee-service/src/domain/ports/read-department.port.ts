export interface IReadDepartmentPort {
  findById(id: string): Promise<{ id: string } | null>;
}

export const READ_DEPARTMENT_PORT = 'IReadDepartmentPort';

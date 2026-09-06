import { Position } from '@app/security';

export type EmployeePermissionReadable = {
  departmentId: string;
  position: Position;
  status: string;
};

export interface IEmployeePermissionReaderPort {
  findByUserId(userId: string): Promise<EmployeePermissionReadable | null>;
}

export const EMPLOYEE_PERMISSION_READER_PORT = 'IEmployeePermissionReaderPort';

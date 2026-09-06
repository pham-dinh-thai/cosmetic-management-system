import { Position } from './position.enum';

export type EmployeeReadable = {
  departmentId: string;
  position: Position;
  status: string;
};

export interface IEmployeeReaderPort {
  findByUserId(userId: string): Promise<EmployeeReadable | null>;
}

export const EMPLOYEE_READER_PORT = 'IEmployeeReaderPort';

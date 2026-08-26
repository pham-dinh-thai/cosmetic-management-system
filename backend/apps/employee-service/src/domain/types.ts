import { EmployeeStatus } from './enums/employee-status.enum';
import { Position } from './enums/position.enum';

export type CreateEmployeeProps = {
  userId: string;
  code: string;
  departmentId: string;
  hiredAt: Date;
  position: Position;
  phone?: string;
  address?: string;
};

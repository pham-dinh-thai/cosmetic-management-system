import { EmployeeStatus } from './enums/employee-status.enum';
import { Position } from './enums/position.enum';
import { EmployeeCode } from './value-objects/employee-code.value-object';

export type CreateEmployeeProps = {
  userId: string;
  code: EmployeeCode;
  departmentId: string;
  hiredAt: Date;
  position: Position;
  phone?: string;
  address?: string;
};

export type FromPersistentEmployeeProps = {
  id: string;
  userId: string;
  code: EmployeeCode;
  departmentId: string;
  hiredAt: Date;
  status: EmployeeStatus;
  position: Position;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
};

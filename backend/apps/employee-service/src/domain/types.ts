import { EmployeeStatus } from './enums/employee-status.enum';
import { EmployeeCode } from './value-objects/employee-code.value-object';

export type CreateEmployeeProps = {
  userId: string;
  code: EmployeeCode;
  departmentId: string;
  hiredAt: Date;
  position: string;
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
  position: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
};

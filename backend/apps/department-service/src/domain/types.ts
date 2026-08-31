import { EmployeeStatus } from './employee/enums/employee-status.enum';
import { Position } from './employee/enums/position.enum';

export type CreateDepartmentProps = {
  code: string;
  name: string;
  managerId?: string;
};

export type FromPersistentDepartmentProps = {
  id: string;
  code: string;
  name: string;
  managerId?: string;
};

export type AssignManagerProps = {
  employeeId: string;
  position: Position;
  status: EmployeeStatus;
};

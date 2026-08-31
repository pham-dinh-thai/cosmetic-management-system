import { Position } from 'apps/employee-service/src/domain/enums/position.enum';

export interface ICreateEmployeeRequest {
  user: {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    password: string;
    roleId: string;
  };
  departmentId: string;
  hiredAt: string;
  position: Position;
  phone?: string;
  address?: string;
}

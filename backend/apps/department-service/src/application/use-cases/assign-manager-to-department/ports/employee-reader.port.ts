import { EmployeeStatus } from 'apps/department-service/src/domain/employee/enums/employee-status.enum';
import { Position } from 'apps/department-service/src/domain/employee/enums/position.enum';

export class FindEmployeeByIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly code: string,
    public readonly departmentId: string,
    public readonly hiredAt: Date,
    public readonly status: EmployeeStatus,
    public readonly position: Position,
    public readonly phone?: string,
    public readonly address?: string,
  ) {}
}

export interface IEmployeeReaderPort {
  findById(id: string): Promise<FindEmployeeByIdReadModel | null>;
}

export const EMPLOYEE_READER_PORT = 'IEmployeeReaderPort';

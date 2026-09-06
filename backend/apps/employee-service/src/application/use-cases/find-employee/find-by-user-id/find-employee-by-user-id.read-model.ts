import { EmployeeStatus } from '../../../../domain/enums/employee-status.enum';
import { Position } from '../../../../domain/enums/position.enum';

export class FindEmployeeByUserIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly departmentId: string,
    public readonly position: Position,
    public readonly status: EmployeeStatus,
  ) {}
}

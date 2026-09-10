import { EmployeeStatus } from '../../../../domain/enums/employee-status.enum';

export class FindEmployeeByUserIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly departmentId: string,
    public readonly position: string,
    public readonly status: EmployeeStatus,
  ) {}
}

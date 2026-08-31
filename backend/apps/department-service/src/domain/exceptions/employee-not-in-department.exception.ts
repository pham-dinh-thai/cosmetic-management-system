import { BaseDomainException } from './base-domain-exception';

export class EmployeeNotInDepartmentException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(employeeId: string, departmentId: string) {
    super(`Employee ${employeeId} not in department ${departmentId}`);
  }
}

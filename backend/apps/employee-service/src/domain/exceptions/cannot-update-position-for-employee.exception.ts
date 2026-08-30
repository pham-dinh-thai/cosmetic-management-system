import { BaseDomainException } from './base-domain-exception';
import { EmployeeStatus } from '../enums/employee-status.enum';

export class CannotUpdatePositionForEmployeeException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(id: string, status: EmployeeStatus) {
    super(`Cannot update position for employee ${id} with status ${status}`);
  }
}
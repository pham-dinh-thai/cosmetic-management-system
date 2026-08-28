import { BaseDomainException } from './base-domain-exception';

export class EmployeeNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Employee with id ${id} not found`);
  }
}

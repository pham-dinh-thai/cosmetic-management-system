import { BaseDomainException } from './base-domain-exception';

export class EmployeeNotActiveException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(id: string) {
    super(`Employee ${id} not active`);
  }
}

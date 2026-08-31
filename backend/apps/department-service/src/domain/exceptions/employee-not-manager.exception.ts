import { BaseDomainException } from './base-domain-exception';

export class EmployeeNotManagerException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(id: string) {
    super(`Employee ${id} is not manager`);
  }
}

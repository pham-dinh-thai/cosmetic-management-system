import { BaseDomainException } from './base-domain-exception';

export class DepartmentNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Department with id ${id} not found`);
  }
}

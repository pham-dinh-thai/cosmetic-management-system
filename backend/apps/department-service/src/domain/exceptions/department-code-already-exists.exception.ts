import { BaseDomainException } from './base-domain-exception';

export class DepartmentCodeAlreadyExistsException extends BaseDomainException {
  public readonly statusCode = 409;

  constructor(code: string) {
    super(`Code already in use: ${code}`);
  }
}

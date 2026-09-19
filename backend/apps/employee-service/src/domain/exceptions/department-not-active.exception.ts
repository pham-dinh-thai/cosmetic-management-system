import { BaseDomainException } from './base-domain-exception';

export class DepartmentNotActiveException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(departmentId: string) {
    super(
      `Department ${departmentId} is not active, cannot assign employee to it`,
    );
  }
}
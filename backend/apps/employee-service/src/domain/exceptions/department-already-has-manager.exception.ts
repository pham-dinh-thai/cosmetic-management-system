import { BaseDomainException } from './base-domain-exception';

export class DepartmentAlreadyHasManagerException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(departmentId: string) {
    super(
      `Department ${departmentId} already has a manager, cannot assign another manager`,
    );
  }
}
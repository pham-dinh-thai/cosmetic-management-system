import { BaseDomainException } from './base-domain.exception';

export class UserDeactivatedException extends BaseDomainException {
  public readonly statusCode = 403;

  public constructor() {
    super('User account is deactivated');
  }
}

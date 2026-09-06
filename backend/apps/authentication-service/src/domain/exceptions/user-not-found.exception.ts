import { BaseDomainException } from './base-domain.exception';

export class UserNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(key: string, value: string) {
    super(`User with ${key} ${value} not found`);
  }
}

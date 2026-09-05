import { BaseDomainException } from './base-domain-exception';

export class CustomerNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(userId: string) {
    super(`Customer for user ${userId} was not found`);
  }
}

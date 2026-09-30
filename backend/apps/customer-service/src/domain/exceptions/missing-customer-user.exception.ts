import { BaseDomainException } from './base-domain-exception';

export class MissingCustomerUserException extends BaseDomainException {
  public readonly statusCode = 400;

  public constructor() {
    super(
      'Customer must be linked to a user (user.user or userId is required)',
    );
  }
}

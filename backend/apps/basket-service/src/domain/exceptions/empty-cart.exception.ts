import { BaseDomainException } from './base-domain-exception';

export class EmptyCartException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor() {
    super('Cart is empty, nothing to checkout');
  }
}

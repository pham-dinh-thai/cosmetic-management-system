import { BaseDomainException } from './base-domain-exception';

export class CartItemNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(variantId: string) {
    super(`Cart item for variant ${variantId} was not found`);
  }
}

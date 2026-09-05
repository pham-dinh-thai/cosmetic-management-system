import { BaseDomainException } from './base-domain-exception';

export class VariantNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(variantId: string) {
    super(`Cosmetic variant ${variantId} was not found`);
  }
}

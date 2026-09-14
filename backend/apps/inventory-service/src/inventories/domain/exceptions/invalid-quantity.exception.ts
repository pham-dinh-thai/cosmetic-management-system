import { BaseDomainException } from 'apps/inventory-service/src/shared/exceptions/base-domain-exception';

export class InvalidQuantityException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_QUANTITY';

  public constructor(message: string) {
    super(message);
  }
}

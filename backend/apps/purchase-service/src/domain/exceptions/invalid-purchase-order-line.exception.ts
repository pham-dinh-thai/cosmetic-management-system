import { BaseDomainException } from './base-domain-exception';

export class InvalidPurchaseOrderLineException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_PURCHASE_ORDER_LINE';

  public constructor(message: string) {
    super(message);
  }
}

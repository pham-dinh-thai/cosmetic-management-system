import { BaseDomainException } from './base-domain-exception';

export class InvalidPurchaseOrderCodeException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_PURCHASE_ORDER_CODE';

  public constructor(value: string) {
    super(`Purchase order code "${value}" is invalid`);
  }
}

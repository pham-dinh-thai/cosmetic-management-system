import { BaseDomainException } from './base-domain-exception';

export class PurchaseOrderNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'PURCHASE_ORDER_NOT_FOUND';

  public constructor(id: string) {
    super(`Purchase order "${id}" was not found`);
  }
}

import { BaseDomainException } from './base-domain-exception';
import { PurchaseOrderStatus } from '../types';

export class InvalidPurchaseOrderStatusException extends BaseDomainException {
  public readonly statusCode = 409;
  public readonly code = 'INVALID_PURCHASE_ORDER_STATUS';

  public constructor(
    id: string,
    from: PurchaseOrderStatus,
    to: PurchaseOrderStatus | 'DELETED',
  ) {
    super(`Purchase order "${id}" cannot move from ${from} to ${to}`);
  }
}

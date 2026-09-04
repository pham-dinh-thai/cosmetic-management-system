import { BaseDomainException } from './base-domain-exception';

export class OrderNotCompletedException extends BaseDomainException {
  public readonly statusCode = 409;
  public readonly code = 'ORDER_NOT_COMPLETED';

  public constructor(orderId: string) {
    super(`Order "${orderId}" is not completed and cannot be invoiced`);
  }
}

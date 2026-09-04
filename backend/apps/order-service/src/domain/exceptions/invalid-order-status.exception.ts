import { BaseDomainException } from './base-domain-exception';
import { OrderStatus } from '../types';

export class InvalidOrderStatusException extends BaseDomainException {
  public readonly statusCode = 409;
  public readonly code = 'INVALID_ORDER_STATUS';

  public constructor(
    id: string,
    from: OrderStatus,
    to: OrderStatus | 'DELETED',
  ) {
    super(`Order "${id}" cannot move from ${from} to ${to}`);
  }
}

import { BaseDomainException } from './base-domain-exception';

export class InsufficientStockException extends BaseDomainException {
  public readonly statusCode = 409;
  public readonly code = 'INSUFFICIENT_STOCK';

  public constructor(variantId: string, requested: number, available: number) {
    super(
      `Insufficient stock for variant "${variantId}": requested ${requested}, available ${available}`,
    );
  }
}

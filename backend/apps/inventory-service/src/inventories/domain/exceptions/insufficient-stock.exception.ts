import { BaseDomainException } from 'apps/inventory-service/src/shared/exceptions/base-domain-exception';

export class InsufficientStockException extends BaseDomainException {
  public readonly statusCode = 409;
  public readonly code = 'INSUFFICIENT_STOCK';

  public constructor(variantId: string, requested: number, available: number) {
    super(
      `Không đủ tồn kho cho variant "${variantId}": yêu cầu ${requested}, hiện có ${available}`,
    );
  }
}

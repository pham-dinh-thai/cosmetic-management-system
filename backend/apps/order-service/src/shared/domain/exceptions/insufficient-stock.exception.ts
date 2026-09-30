import { BaseDomainException } from 'apps/order-service/src/shared/domain/exceptions/base-domain-exception';

export class InsufficientStockException extends BaseDomainException {
  public readonly statusCode = 409;
  public readonly code = 'INSUFFICIENT_STOCK';

  public constructor(
    variantId: string,
    requested: number,
    available: number,
    message?: string,
  ) {
    super(
      message ??
        `Không đủ hàng cho biến thể "${variantId}": yêu cầu ${requested}, có sẵn ${available}`,
    );
  }
}

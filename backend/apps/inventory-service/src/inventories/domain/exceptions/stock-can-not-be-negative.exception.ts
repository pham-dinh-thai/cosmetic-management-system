import { BaseDomainException } from 'apps/inventory-service/src/shared/exceptions/base-domain-exception';

export class StockCanNotBeNegativeException extends BaseDomainException {
  public readonly statusCode = 401;
  public readonly code = 'STOCK_NEGATIVE';

  public constructor() {
    super(`Số lượng tồn kho không thể âm`);
  }
}

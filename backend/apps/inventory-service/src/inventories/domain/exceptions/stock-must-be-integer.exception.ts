import { BaseDomainException } from 'apps/inventory-service/src/shared/exceptions/base-domain-exception';

export class StockMustBeIntegerException extends BaseDomainException {
  public readonly statusCode = 401;
  public readonly code = 'STOCK_MUST_BE_INTEGER';

  public constructor() {
    super(`Số lượng tồn kho phải là số nguyên`);
  }
}

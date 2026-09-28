import { BaseDomainException } from 'apps/order-service/src/shared/domain/exceptions/base-domain-exception';

export class InvalidOrderCodeException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_ORDER_CODE';

  public constructor(value: string) {
    super(`Mã đơn hàng "${value}" không hợp lệ`);
  }
}

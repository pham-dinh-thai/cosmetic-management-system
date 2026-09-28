import { BaseDomainException } from 'apps/order-service/src/shared/domain/exceptions/base-domain-exception';

export class OrderNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'ORDER_NOT_FOUND';

  public constructor(id: string) {
    super(`Không tìm thấy đơn hàng "${id}"`);
  }
}

import { BaseDomainException } from 'apps/order-service/src/shared/domain/exceptions/base-domain-exception';

export class CanNotUpdateOrderStatusException extends BaseDomainException {
  public readonly statusCode = 409;
  public readonly code = 'CAN_NOT_UPDATE_ORDER_STATUS';

  public constructor(message?: string) {
    super(message ?? `Không thể cập nhật trạng thái đơn hàng này`);
  }
}

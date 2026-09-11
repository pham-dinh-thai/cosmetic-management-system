import { BaseDomainException } from './base-domain-exception';

export class CosmeticHasOrdersException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(name: string) {
    super(
      `Không thể xoá sản phẩm "${name}" vì có biến thể đã được khách hàng đặt mua`,
    );
  }
}

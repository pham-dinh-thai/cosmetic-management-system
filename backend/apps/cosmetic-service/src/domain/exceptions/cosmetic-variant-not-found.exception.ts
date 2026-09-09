import { BaseDomainException } from './base-domain-exception';

export class CosmeticVariantNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Biến thể mỹ phẩm id ${id} không tồn tại`);
  }
}

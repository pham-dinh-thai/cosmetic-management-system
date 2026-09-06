import { BaseDomainException } from './base-domain-exception';

export class VariantNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'VARIANT_NOT_FOUND';

  public constructor(variantId: string) {
    super(`Không tìm thấy biến thể sản phẩm: ${variantId}`);
  }
}

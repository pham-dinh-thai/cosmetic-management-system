import { BaseDomainException } from '../../../shared/exceptions/base-domain-exception';

export class InvalidAdjustmentQuantityException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_ADJUSTMENT_QUANTITY';

  public constructor() {
    super(
      'Số lượng điều chỉnh không được bằng 0 (âm để điều chỉnh giảm, dương để điều chỉnh tăng)',
    );
  }
}
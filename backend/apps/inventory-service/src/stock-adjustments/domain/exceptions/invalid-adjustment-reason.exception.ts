import { BaseDomainException } from '../../../shared/exceptions/base-domain-exception';

export class InvalidAdjustmentReasonException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_ADJUSTMENT_REASON';

  public constructor(reason: string) {
    super(
      `Lý do điều chỉnh "${reason}" không hợp lệ. Hợp lệ: DAMAGED, DEFECTIVE, EXPIRED, OVERSTOCK, OTHER`,
    );
  }
}

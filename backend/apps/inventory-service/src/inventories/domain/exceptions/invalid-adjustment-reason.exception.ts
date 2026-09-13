import { BaseDomainException } from './base-domain-exception';

export class InvalidAdjustmentReasonException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_ADJUSTMENT_REASON';

  public constructor(reason: string) {
    super(
      `Adjustment reason "${reason}" is not allowed. Allowed: DAMAGED, DEFECTIVE, EXPIRED, OVERSTOCK, OTHER`,
    );
  }
}

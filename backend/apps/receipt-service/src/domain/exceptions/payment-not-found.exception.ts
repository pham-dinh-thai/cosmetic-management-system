import { BaseDomainException } from './base-domain-exception';

export class PaymentNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'PAYMENT_NOT_FOUND';

  public constructor(id: string) {
    super(`Phiếu chi "${id}" không tồn tại`);
  }
}
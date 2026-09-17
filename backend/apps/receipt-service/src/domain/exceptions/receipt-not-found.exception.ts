import { BaseDomainException } from './base-domain-exception';

export class ReceiptNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'RECEIPT_NOT_FOUND';

  public constructor(id: string) {
    super(`Phiếu thu "${id}" không tồn tại`);
  }
}
import { BaseDomainException } from './base-domain-exception';

export class BatchNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'BATCH_NOT_FOUND';

  public constructor(key: string, value: any) {
    super(`Lô hàng ${key} "${value}" không tồn tại`);
  }
}

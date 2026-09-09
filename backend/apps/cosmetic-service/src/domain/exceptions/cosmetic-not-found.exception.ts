import { BaseDomainException } from './base-domain-exception';

export class CosmeticNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Mỹ phẩm id: ${id} không tồn tại`);
  }
}

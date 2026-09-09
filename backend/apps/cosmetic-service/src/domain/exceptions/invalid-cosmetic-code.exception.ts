import { BaseDomainException } from './base-domain-exception';

export class InvalidCosmeticCodeException extends BaseDomainException {
  public readonly statusCode = 400;

  public constructor(code: string) {
    super(`Code mỹ phẩm không hợp lệ: ${code}`);
  }
}

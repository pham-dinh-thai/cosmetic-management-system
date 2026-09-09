import { BaseDomainException } from './base-domain-exception';

export class NegativePriceException extends BaseDomainException {
  public readonly statusCode = 400;

  public constructor(value: number) {
    super(`Giá mỹ phẩm không thể âm: ${value}`);
  }
}

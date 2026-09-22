import { BaseDomainException } from './base-domain-exception';

export class CostPriceCanNotBeHigherThanPriceException extends BaseDomainException {
  public readonly statusCode = 400;

  public constructor() {
    super(`Giá gốc (giá nhập) phải nhỏ hơn giá bán`);
  }
}

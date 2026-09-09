import { BaseDomainException } from './base-domain-exception';

export class CostPriceCanNotBeHigherThanPriceException extends BaseDomainException {
  public readonly statusCode = 401;

  public constructor() {
    super(`Giá nhập không thể lớn hơn giá bán`);
  }
}

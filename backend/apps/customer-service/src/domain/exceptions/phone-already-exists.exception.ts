import { BaseDomainException } from './base-domain-exception';

export class PhoneAlreadyExistsException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(phone: string) {
    super(`Số điện thoại ${phone} đã thuộc khách hàng khác`);
  }
}

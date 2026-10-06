import { HttpStatus } from '@nestjs/common';
import { BaseDomainException } from './base-domain-exception';

export class LastAddressRemovalException extends BaseDomainException {
  public readonly statusCode = HttpStatus.CONFLICT;

  public constructor() {
    super('Mỗi người dùng phải có ít nhất một địa chỉ.');
  }
}

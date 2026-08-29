import { BaseDomainException } from './base-domain-exception';

export class InvalidPhoneNumberException extends BaseDomainException {
  public readonly statusCode = 401;

  public constructor(phone: string) {
    super(`Phone number: ${phone} is not a valid Vietnamese's phone number`);
  }
}

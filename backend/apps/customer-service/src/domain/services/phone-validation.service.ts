import { InvalidPhoneNumberException } from '../exceptions/invalid-phone-number.exception';

/**
 * Vietnamese mobile phone number only (landline 02x not supported).
 * Must start with 03, 05, 07, 08, 09 and have exactly 10 digits total.
 */
const VIETNAM_PHONE_REGEX = /^(03|05|07|08|09)[0-9]{8}$/;

export class PhoneValidationService {
  public ensureValidPhone(phone: string): void {
    if (!VIETNAM_PHONE_REGEX.test(phone)) {
      throw new InvalidPhoneNumberException(phone);
    }
  }
}

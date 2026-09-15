import { InvalidPhoneNumberException } from '../exceptions/invalid-phone-number.exception';

export class Phone {
  /**
   * Vietnamese phone number:
   * - Mobile: must start with 03, 05, 07, 08, 09 and have exactly 10 digits.
   * - Landline (02x) and legacy 11-digit numbers: start with 0 and have exactly 11 digits.
   */
  private static readonly VIETNAM_PHONE_REGEX =
    /^((03|05|07|08|09)[0-9]{8}|0[0-9]{10})$/;

  private constructor(private readonly value: string) {}

  public static create(value: string): Phone {
    if (!this.VIETNAM_PHONE_REGEX.test(value)) {
      throw new InvalidPhoneNumberException(value);
    }

    return new Phone(value);
  }

  public static fromPersistent(value: string): Phone {
    return new Phone(value);
  }

  public getValue(): string {
    return this.value;
  }
}

import { InvalidPhoneNumberException } from '../exceptions/invalid-phone-number.exception';

export class EmployeePhone {
  /**
   * Vietnamese mobile phone number only (landline 02x not supported).
   * Must start with 03, 05, 07, 08, 09 and have exactly 10 digits total.
   */
  private static readonly VIETNAM_PHONE_REGEX = /^(03|05|07|08|09)[0-9]{8}$/;

  private constructor(private readonly value: string) {}

  public static create(value: string): EmployeePhone {
    if (!this.VIETNAM_PHONE_REGEX.test(value)) {
      throw new InvalidPhoneNumberException(value);
    }

    return new EmployeePhone(value);
  }

  public static fromPersistent(value: string): EmployeePhone {
    return new EmployeePhone(value);
  }

  public getValue(): string {
    return this.value;
  }
}

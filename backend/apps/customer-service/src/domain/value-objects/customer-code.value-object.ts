import { generateCode, isCodeFormatValid } from '@app/codes';
import { InvalidCustomerCodeException } from '../exceptions/invalid-customer-code.exception';

export const CUSTOMER_CODE_PREFIX = 'KH_';

export class CustomerCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): CustomerCode {
    if (sequence < 1) {
      throw new InvalidCustomerCodeException(sequence.toString());
    }

    return new CustomerCode(generateCode(CUSTOMER_CODE_PREFIX, sequence));
  }

  public static fromPersistent(value: string): CustomerCode {
    if (!isCodeFormatValid(CUSTOMER_CODE_PREFIX, value)) {
      throw new InvalidCustomerCodeException(value);
    }

    return new CustomerCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}

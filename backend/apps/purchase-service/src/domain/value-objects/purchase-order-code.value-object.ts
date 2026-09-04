import { InvalidPurchaseOrderCodeException } from '../exceptions/invalid-purchase-order-code.exception';

const PURCHASE_ORDER_CODE_PREFIX = 'PN_';
const MIN_CODE_DIGITS = 5;

const PURCHASE_ORDER_CODE_REGEX = /^PN_\d{5,}$/;

export class PurchaseOrderCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): PurchaseOrderCode {
    if (sequence < 1) {
      throw new InvalidPurchaseOrderCodeException(sequence.toString());
    }

    return new PurchaseOrderCode(
      `${PURCHASE_ORDER_CODE_PREFIX}${sequence
        .toString()
        .padStart(MIN_CODE_DIGITS, '0')}`,
    );
  }

  public static fromPersistent(value: string): PurchaseOrderCode {
    if (!PURCHASE_ORDER_CODE_REGEX.test(value)) {
      throw new InvalidPurchaseOrderCodeException(value);
    }

    return new PurchaseOrderCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}

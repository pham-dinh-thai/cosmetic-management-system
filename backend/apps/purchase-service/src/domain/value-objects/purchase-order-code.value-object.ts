import { InvalidPurchaseOrderCodeException } from '../exceptions/invalid-purchase-order-code.exception';
import { generateCode, isCodeFormatValid } from '@app/codes';

export const PURCHASE_ORDER_CODE_PREFIX = 'PN_';

export class PurchaseOrderCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): PurchaseOrderCode {
    if (sequence < 1) {
      throw new InvalidPurchaseOrderCodeException(sequence.toString());
    }

    return new PurchaseOrderCode(
      generateCode(PURCHASE_ORDER_CODE_PREFIX, sequence),
    );
  }

  public static fromPersistent(value: string): PurchaseOrderCode {
    if (!isCodeFormatValid(PURCHASE_ORDER_CODE_PREFIX, value)) {
      throw new InvalidPurchaseOrderCodeException(value);
    }

    return new PurchaseOrderCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}

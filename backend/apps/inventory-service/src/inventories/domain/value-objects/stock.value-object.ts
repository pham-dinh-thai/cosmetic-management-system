import { StockCanNotBeNegativeException } from '../exceptions/stock-can-not-be-negative.exception';
import { StockMustBeIntegerException } from '../exceptions/stock-must-be-integer.exception';

export class Stock {
  private constructor(private readonly value: number) {}

  public static create(value: number): Stock {
    if (value < 0) {
      throw new StockCanNotBeNegativeException();
    }

    if (!Number.isInteger(value)) {
      throw new StockMustBeIntegerException();
    }

    return new Stock(value);
  }

  public static fromPersistent(value: number): Stock {
    return new Stock(value);
  }

  public getValue(): number {
    return this.value;
  }
}

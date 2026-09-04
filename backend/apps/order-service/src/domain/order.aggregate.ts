import { OrderLine } from './entities/order-line.entity';
import { InvalidOrderStatusException } from './exceptions/invalid-order-status.exception';
import {
  CreateOrderLineProps,
  CreateOrderProps,
  FromPersistentOrderProps,
  OrderStatus,
} from './types';

export class Order {
  private constructor(
    private readonly id: string,
    private readonly code: string,
    private readonly customerId: string,
    private status: OrderStatus,
    private totalAmount: number,
    private readonly lines: OrderLine[],
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateOrderProps): Order {
    const lines = props.lines.map((line) => OrderLine.create(line));

    return new Order(
      undefined as unknown as string,
      props.code,
      props.customerId,
      OrderStatus.PENDING,
      Order.calculateTotal(lines),
      lines,
    );
  }

  public static fromPersistent(props: FromPersistentOrderProps): Order {
    return new Order(
      props.id,
      props.code,
      props.customerId,
      props.status,
      props.totalAmount,
      props.lines.map((line) => OrderLine.fromPersistent(line)),
      props.createdAt,
      props.updatedAt,
    );
  }

  private static calculateTotal(lines: OrderLine[]): number {
    return lines.reduce((sum, line) => sum + line.getSubtotal(), 0);
  }

  public replaceLines(lines: CreateOrderLineProps[]): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidOrderStatusException(
        this.id,
        this.status,
        OrderStatus.PENDING,
      );
    }

    this.lines.splice(
      0,
      this.lines.length,
      ...lines.map((line) => OrderLine.create(line)),
    );
    this.totalAmount = Order.calculateTotal(this.lines);
  }

  public complete(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidOrderStatusException(
        this.id,
        this.status,
        OrderStatus.COMPLETED,
      );
    }

    this.status = OrderStatus.COMPLETED;
  }

  public cancel(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidOrderStatusException(
        this.id,
        this.status,
        OrderStatus.CANCELLED,
      );
    }

    this.status = OrderStatus.CANCELLED;
  }

  public isCompletable(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  public getId(): string {
    return this.id;
  }

  public getCode(): string {
    return this.code;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }

  public getLines(): OrderLine[] {
    return [...this.lines];
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}

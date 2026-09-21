import { OrderLine } from './entities/order-line.entity';
import { InvalidOrderStatusException } from './exceptions/invalid-order-status.exception';
import {
  CreateOrderLineProps,
  CreateOrderProps,
  FromPersistentOrderProps,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
} from './types';

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING_CONFIRMATION]: [
    OrderStatus.CONFIRMED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.SHIPPING, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPING]: [
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERY_FAILED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED],
  [OrderStatus.DELIVERY_FAILED]: [OrderStatus.RETURNED, OrderStatus.CANCELLED],
  [OrderStatus.RETURNED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
};

export class Order {
  private constructor(
    private readonly id: string,
    private readonly code: string,
    private readonly customerId: string,
    private readonly paymentMethod: OrderPaymentMethod,
    private paymentStatus: OrderPaymentStatus,
    private status: OrderStatus,
    private totalAmount: number,
    private readonly lines: OrderLine[],
    private readonly recipientName?: string | null,
    private readonly recipientPhone?: string | null,
    private readonly shippingAddress?: string | null,
    private readonly shippingCity?: string | null,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateOrderProps): Order {
    const lines = props.lines.map((line) => OrderLine.create(line));

    return new Order(
      undefined as unknown as string,
      props.code,
      props.customerId,
      props.paymentMethod,
      props.paymentStatus ?? OrderPaymentStatus.UNPAID,
      OrderStatus.PENDING_CONFIRMATION,
      Order.calculateTotal(lines),
      lines,
      props.recipientName,
      props.recipientPhone,
      props.shippingAddress,
      props.shippingCity,
    );
  }

  public static fromPersistent(props: FromPersistentOrderProps): Order {
    return new Order(
      props.id,
      props.code,
      props.customerId,
      props.paymentMethod,
      props.paymentStatus,
      props.status,
      props.totalAmount,
      props.lines.map((line) => OrderLine.fromPersistent(line)),
      props.recipientName,
      props.recipientPhone,
      props.shippingAddress,
      props.shippingCity,
      props.createdAt,
      props.updatedAt,
    );
  }

  private static calculateTotal(lines: OrderLine[]): number {
    return lines.reduce((sum, line) => sum + line.getSubtotal(), 0);
  }

  private transitionTo(next: OrderStatus): void {
    const allowed = ORDER_TRANSITIONS[this.status] ?? [];

    if (!allowed.includes(next)) {
      throw new InvalidOrderStatusException(this.id, this.status, next);
    }

    this.status = next;
  }

  public replaceLines(lines: CreateOrderLineProps[]): void {
    if (this.status !== OrderStatus.PENDING_CONFIRMATION) {
      throw new InvalidOrderStatusException(
        this.id,
        this.status,
        OrderStatus.PENDING_CONFIRMATION,
      );
    }

    this.lines.splice(
      0,
      this.lines.length,
      ...lines.map((line) => OrderLine.create(line)),
    );
    this.totalAmount = Order.calculateTotal(this.lines);
  }

  public confirm(): void {
    this.transitionTo(OrderStatus.CONFIRMED);
  }

  public startPreparing(): void {
    this.transitionTo(OrderStatus.PREPARING);
  }

  public startShipping(): void {
    this.transitionTo(OrderStatus.SHIPPING);
  }

  public deliver(): void {
    this.transitionTo(OrderStatus.DELIVERED);
  }

  public failDelivery(): void {
    this.transitionTo(OrderStatus.DELIVERY_FAILED);
  }

  public returnOrder(): void {
    this.transitionTo(OrderStatus.RETURNED);
  }

  public refund(): void {
    this.transitionTo(OrderStatus.REFUNDED);
  }

  public cancel(): void {
    this.transitionTo(OrderStatus.CANCELLED);
  }

  public markPaid(): void {
    this.paymentStatus = OrderPaymentStatus.PAID;
  }

  public markUnpaid(): void {
    this.paymentStatus = OrderPaymentStatus.UNPAID;
  }

  public isPendingConfirmation(): boolean {
    return this.status === OrderStatus.PENDING_CONFIRMATION;
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

  public getPaymentMethod(): OrderPaymentMethod {
    return this.paymentMethod;
  }

  public getPaymentStatus(): OrderPaymentStatus {
    return this.paymentStatus;
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

  public getRecipientName(): string | null | undefined {
    return this.recipientName;
  }

  public getRecipientPhone(): string | null | undefined {
    return this.recipientPhone;
  }

  public getShippingAddress(): string | null | undefined {
    return this.shippingAddress;
  }

  public getShippingCity(): string | null | undefined {
    return this.shippingCity;
  }
}

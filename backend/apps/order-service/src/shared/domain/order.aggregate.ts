import { OrderLine } from './entities/order-line.entity';
import { OrderPaymentMethod } from './enums/order-payment-method.enum';
import { OrderPaymentStatus } from './enums/order-payment-status.enum';
import { OrderStatus } from './enums/order-status.enum';
import { CanNotUpdateOrderStatusException } from './exceptions/can-not-update-order-status.exception';
import { OrderConfirmed } from './events/order-confirmed.event';
import { AggregateRoot } from './aggregate-root';
import { OrderPreparing } from './events/order-preparing.event';
import { OrderShipping } from './events/order-shipping.event';
import { OrderDelivered } from './events/order-delivered.event';
import { OrderCompleted } from './events/order-completed.event';
import { OrderCancelled } from './events/order-cancelled.event';
import { OrderDeliveryFailed } from './events/order-delivery-failed.event';
import { OrderReturned } from './events/order-returned.event';
import { OrderRefunded } from './events/order-refunded.event';
import { OrderDomainEvent } from './events/order-domain.event';

export type OrderLineProps = {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderLineProps = {
  variantId: string;
  quantity: number;
  unitPrice: number;
};

export type CreateOrderProps = {
  code: string;
  customerId: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus?: OrderPaymentStatus;
  lines: CreateOrderLineProps[];
  recipientName?: string | null;
  recipientPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
};

export type FromPersistentOrderProps = {
  id: string;
  code: string;
  customerId: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  status: OrderStatus;
  totalAmount: number;
  lines: OrderLineProps[];
  recipientName: string | null;
  recipientPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Order extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private readonly code: string,
    private readonly customerId: string,
    private readonly paymentMethod: OrderPaymentMethod,
    private paymentStatus: OrderPaymentStatus,
    private status: OrderStatus,
    private totalAmount: number,
    private readonly lines: OrderLine[],
    private readonly recipientName: string | null,
    private readonly recipientPhone: string | null,
    private readonly shippingAddress: string | null,
    private readonly shippingCity: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  public static create(props: CreateOrderProps): Order {
    const lines = props.lines.map((line) => OrderLine.create(line));

    return new Order(
      undefined as unknown as string,
      props.code,
      props.customerId,
      props.paymentMethod,
      props.paymentStatus ?? OrderPaymentStatus.UNPAID,
      OrderStatus.PENDING,
      Order.calculateTotal(lines),
      lines,
      props.recipientName ?? null,
      props.recipientPhone ?? null,
      props.shippingAddress ?? null,
      props.shippingCity ?? null,
      new Date(),
      new Date(),
    );
  }

  private static calculateTotal(lines: OrderLine[]): number {
    return lines.reduce((sum, line) => sum + line.getSubtotal(), 0);
  }

  public static fromPersistent(props: FromPersistentOrderProps): Order {
    const lines = props.lines.map((line: OrderLineProps) =>
      OrderLine.fromPersistent({
        id: line.id,
        orderId: props.id,
        variantId: line.variantId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        createdAt: line.createdAt,
        updatedAt: line.updatedAt,
      }),
    );

    return new Order(
      props.id,
      props.code,
      props.customerId,
      props.paymentMethod,
      props.paymentStatus,
      props.status,
      props.totalAmount,
      lines,
      props.recipientName,
      props.recipientPhone,
      props.shippingAddress,
      props.shippingCity,
      props.createdAt,
      props.updatedAt,
    );
  }

  public markAsConfirmed(): void {
    this.transitionTo(
      OrderStatus.CONFIRMED,
      [OrderStatus.PENDING],
      new OrderConfirmed(this.id, this.customerId),
    );
  }

  public markAsPreparing(): void {
    this.transitionTo(
      OrderStatus.PREPARING,
      [OrderStatus.CONFIRMED],
      new OrderPreparing(this.id, this.customerId),
    );
  }

  public markAsShipping(): void {
    this.transitionTo(
      OrderStatus.SHIPPING,
      [OrderStatus.PREPARING],
      new OrderShipping(this.id, this.customerId),
    );
  }

  public markAsDelivered(): void {
    this.transitionTo(
      OrderStatus.DELIVERED,
      [OrderStatus.SHIPPING],
      new OrderDelivered(this.id, this.customerId),
    );
  }

  public markAsCompleted(): void {
    if (this.paymentStatus === OrderPaymentStatus.UNPAID) {
      throw new CanNotUpdateOrderStatusException('Đơn hàng chưa thanh toán');
    }

    this.transitionTo(
      OrderStatus.COMPLETED,
      [OrderStatus.DELIVERED],
      new OrderCompleted(this.id, this.customerId),
    );
  }

  public markAsSold(): void {
    if (this.paymentStatus !== OrderPaymentStatus.PAID) {
      throw new CanNotUpdateOrderStatusException('Đơn hàng chưa thanh toán');
    }

    this.transitionTo(
      OrderStatus.COMPLETED,
      [OrderStatus.PENDING],
      new OrderCompleted(this.id, this.customerId),
    );
  }

  public markPaid(): void {
    this.paymentStatus = OrderPaymentStatus.PAID;
    this.updatedAt = new Date();
  }

  public markUnpaid(): void {
    this.paymentStatus = OrderPaymentStatus.UNPAID;
    this.updatedAt = new Date();
  }

  public replaceLines(lines: CreateOrderLineProps[]): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new CanNotUpdateOrderStatusException(
        'Chỉ có thể sửa đơn hàng khi đang chờ xác nhận',
      );
    }

    this.lines.splice(
      0,
      this.lines.length,
      ...lines.map((line) => OrderLine.create(line)),
    );

    this.totalAmount = Order.calculateTotal(this.lines);
    this.updatedAt = new Date();
  }

  public isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  public isPaymentPaid(): boolean {
    return this.paymentStatus === OrderPaymentStatus.PAID;
  }

  public markAsCancelled(): void {
    this.transitionTo(
      OrderStatus.CANCELLED,
      [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.SHIPPING,
        OrderStatus.DELIVERY_FAILED,
      ],
      new OrderCancelled(this.id, this.customerId),
    );
  }

  public markAsDeliveryFailed(): void {
    this.transitionTo(
      OrderStatus.DELIVERY_FAILED,
      [OrderStatus.SHIPPING],
      new OrderDeliveryFailed(this.id, this.customerId),
    );
  }

  public markAsReturned(): void {
    this.transitionTo(
      OrderStatus.RETURNED,
      [OrderStatus.DELIVERY_FAILED, OrderStatus.COMPLETED],
      new OrderReturned(this.id, this.customerId),
    );
  }

  public markAsRefunded(): void {
    this.transitionTo(
      OrderStatus.REFUNDED,
      [OrderStatus.CANCELLED, OrderStatus.RETURNED],
      new OrderRefunded(this.id, this.customerId),
    );
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

  public getRecipientName(): string | null {
    return this.recipientName;
  }

  public getRecipientPhone(): string | null {
    return this.recipientPhone;
  }

  public getShippingAddress(): string | null {
    return this.shippingAddress;
  }

  public getShippingCity(): string | null {
    return this.shippingCity;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  private transitionTo(
    to: OrderStatus,
    allowed: OrderStatus[],
    event: OrderDomainEvent,
  ): void {
    if (!allowed.includes(this.status)) {
      throw new CanNotUpdateOrderStatusException(
        `Không thể chuyển trạng thái đơn hàng từ ${this.status} sang ${to}`,
      );
    }

    this.status = to;

    this.updatedAt = new Date();

    this.events.push(event);
  }
}

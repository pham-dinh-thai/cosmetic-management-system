import { InvoicePaymentException } from './exceptions/invoice-payment.exception';
import {
  CreateInvoiceProps,
  FromPersistentInvoiceProps,
  InvoiceStatus,
} from './types';

export class Invoice {
  private constructor(
    private readonly id: string,
    private readonly code: string,
    private readonly orderId: string,
    private readonly customerId: string,
    private readonly totalAmount: number,
    private paidAmount: number,
    private status: InvoiceStatus,
    private readonly note?: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateInvoiceProps): Invoice {
    return new Invoice(
      undefined as unknown as string,
      props.code,
      props.orderId,
      props.customerId,
      props.totalAmount,
      0,
      InvoiceStatus.UNPAID,
      props.note,
    );
  }

  public static fromPersistent(props: FromPersistentInvoiceProps): Invoice {
    return new Invoice(
      props.id,
      props.code,
      props.orderId,
      props.customerId,
      props.totalAmount,
      props.paidAmount,
      props.status,
      props.note,
      props.createdAt,
      props.updatedAt,
    );
  }

  public applyPayment(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new InvoicePaymentException(
        'Payment amount must be a positive number',
      );
    }

    const unpaidBalance = this.getUnpaidBalance();

    if (amount > unpaidBalance) {
      throw new InvoicePaymentException(
        `Payment amount ${amount} exceeds unpaid balance ${unpaidBalance}`,
      );
    }

    this.paidAmount += amount;
    this.status =
      this.paidAmount >= this.totalAmount
        ? InvoiceStatus.PAID
        : InvoiceStatus.PARTIAL;
  }

  public getUnpaidBalance(): number {
    return this.totalAmount - this.paidAmount;
  }

  public getId(): string {
    return this.id;
  }

  public getCode(): string {
    return this.code;
  }

  public getOrderId(): string {
    return this.orderId;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }

  public getPaidAmount(): number {
    return this.paidAmount;
  }

  public getStatus(): InvoiceStatus {
    return this.status;
  }

  public getNote(): string | undefined {
    return this.note;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}

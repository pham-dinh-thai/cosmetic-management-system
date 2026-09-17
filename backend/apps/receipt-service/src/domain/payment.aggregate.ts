import {
  CreatePaymentProps,
  FromPersistentPaymentProps,
  PaymentCategory,
  PaymentSource,
} from './types';

export class Payment {
  private constructor(
    private readonly id: string,
    private readonly code: string,
    private readonly amount: number,
    private readonly category: PaymentCategory,
    private readonly source: PaymentSource,
    private readonly purchaseOrderId?: string,
    private readonly supplierId?: string,
    private readonly note?: string,
    private readonly employeeId?: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreatePaymentProps): Payment {
    return new Payment(
      undefined as unknown as string,
      props.code,
      props.amount,
      props.category ?? PaymentCategory.OTHER,
      props.source ?? PaymentSource.MANUAL,
      props.purchaseOrderId,
      props.supplierId,
      props.note,
      props.employeeId,
    );
  }

  public static fromPersistent(props: FromPersistentPaymentProps): Payment {
    return new Payment(
      props.id,
      props.code,
      props.amount,
      props.category,
      props.source,
      props.purchaseOrderId,
      props.supplierId,
      props.note,
      props.employeeId,
      props.createdAt,
      props.updatedAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getCode(): string {
    return this.code;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCategory(): PaymentCategory {
    return this.category;
  }

  public getSource(): PaymentSource {
    return this.source;
  }

  public getPurchaseOrderId(): string | undefined {
    return this.purchaseOrderId;
  }

  public getSupplierId(): string | undefined {
    return this.supplierId;
  }

  public getNote(): string | undefined {
    return this.note;
  }

  public getEmployeeId(): string | undefined {
    return this.employeeId;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
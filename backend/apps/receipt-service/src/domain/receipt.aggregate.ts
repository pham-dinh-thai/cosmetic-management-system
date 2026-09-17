import {
  CreateReceiptProps,
  FromPersistentReceiptProps,
  ReceiptSource,
} from './types';

export class Receipt {
  private constructor(
    private readonly id: string,
    private readonly code: string,
    private readonly amount: number,
    private readonly source: ReceiptSource,
    private readonly invoiceId?: string,
    private readonly customerId?: string,
    private readonly note?: string,
    private readonly employeeId?: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateReceiptProps): Receipt {
    return new Receipt(
      undefined as unknown as string,
      props.code,
      props.amount,
      props.source ?? ReceiptSource.MANUAL,
      props.invoiceId,
      props.customerId,
      props.note,
      props.employeeId,
    );
  }

  public static fromPersistent(props: FromPersistentReceiptProps): Receipt {
    return new Receipt(
      props.id,
      props.code,
      props.amount,
      props.source,
      props.invoiceId,
      props.customerId,
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

  public getSource(): ReceiptSource {
    return this.source;
  }

  public getInvoiceId(): string | undefined {
    return this.invoiceId;
  }

  public getCustomerId(): string | undefined {
    return this.customerId;
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
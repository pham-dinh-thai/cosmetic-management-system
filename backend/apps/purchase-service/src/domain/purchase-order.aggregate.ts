import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { InvalidPurchaseOrderStatusException } from './exceptions/invalid-purchase-order-status.exception';
import {
  CreatePurchaseOrderLineProps,
  CreatePurchaseOrderProps,
  FromPersistentPurchaseOrderProps,
  PurchaseOrderStatus,
} from './types';

export class PurchaseOrder {
  private constructor(
    private readonly id: string,
    private readonly code: string,
    private readonly supplierId: string,
    private status: PurchaseOrderStatus,
    private totalAmount: number,
    private readonly lines: PurchaseOrderLine[],
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreatePurchaseOrderProps): PurchaseOrder {
    const lines = props.lines.map((line) => PurchaseOrderLine.create(line));

    return new PurchaseOrder(
      undefined as unknown as string,
      props.code,
      props.supplierId,
      PurchaseOrderStatus.PENDING,
      PurchaseOrder.calculateTotal(lines),
      lines,
    );
  }

  public static fromPersistent(
    props: FromPersistentPurchaseOrderProps,
  ): PurchaseOrder {
    return new PurchaseOrder(
      props.id,
      props.code,
      props.supplierId,
      props.status,
      props.totalAmount,
      props.lines.map((line) => PurchaseOrderLine.fromPersistent(line)),
      props.createdAt,
      props.updatedAt,
    );
  }

  private static calculateTotal(lines: PurchaseOrderLine[]): number {
    return lines.reduce((sum, line) => sum + line.getSubtotal(), 0);
  }

  public replaceLines(lines: CreatePurchaseOrderLineProps[]): void {
    if (this.status !== PurchaseOrderStatus.PENDING) {
      throw new InvalidPurchaseOrderStatusException(
        this.id,
        this.status,
        PurchaseOrderStatus.PENDING,
      );
    }

    this.lines.splice(
      0,
      this.lines.length,
      ...lines.map((line) => PurchaseOrderLine.create(line)),
    );
    this.totalAmount = PurchaseOrder.calculateTotal(this.lines);
  }

  public complete(): void {
    if (this.status !== PurchaseOrderStatus.PENDING) {
      throw new InvalidPurchaseOrderStatusException(
        this.id,
        this.status,
        PurchaseOrderStatus.COMPLETED,
      );
    }

    this.status = PurchaseOrderStatus.COMPLETED;
  }

  public cancel(): void {
    if (this.status !== PurchaseOrderStatus.PENDING) {
      throw new InvalidPurchaseOrderStatusException(
        this.id,
        this.status,
        PurchaseOrderStatus.CANCELLED,
      );
    }

    this.status = PurchaseOrderStatus.CANCELLED;
  }

  public isCompletable(): boolean {
    return this.status === PurchaseOrderStatus.PENDING;
  }

  public getId(): string {
    return this.id;
  }

  public getCode(): string {
    return this.code;
  }

  public getSupplierId(): string {
    return this.supplierId;
  }

  public getStatus(): PurchaseOrderStatus {
    return this.status;
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }

  public getLines(): PurchaseOrderLine[] {
    return [...this.lines];
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}

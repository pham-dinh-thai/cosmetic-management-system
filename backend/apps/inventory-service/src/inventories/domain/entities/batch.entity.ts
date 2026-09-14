export type CreateBatchProps = {
  lotNumber: string;
  inventoryId: string;
  supplierId: string;
  quantity: number;
  expiredDate: Date;
  createdBy: string;
};

export type FromPersistentBatchProps = {
  id: string;
  lotNumber: string;
  inventoryId: string;
  supplierId: string;
  quantity: number;
  expiredDate: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Batch {
  private constructor(
    private readonly id: string,
    private readonly lotNumber: string,
    private readonly inventoryId: string,
    private readonly supplierId: string,
    private quantity: number,
    private readonly expiredDate: Date,
    private isActive: boolean,
    private readonly createdBy: string,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(props: CreateBatchProps): Batch {
    return new Batch(
      undefined as unknown as string,
      props.lotNumber,
      props.inventoryId,
      props.supplierId,
      props.quantity,
      props.expiredDate,
      true,
      props.createdBy,
      new Date(),
      new Date(),
    );
  }

  public static fromPersistent(props: FromPersistentBatchProps): Batch {
    return new Batch(
      props.id,
      props.lotNumber,
      props.inventoryId,
      props.supplierId,
      props.quantity,
      props.expiredDate,
      props.isActive,
      props.createdBy,
      props.createdAt,
      props.updatedAt,
    );
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getLotNumber(): string {
    return this.lotNumber;
  }

  public getInventoryId(): string {
    return this.inventoryId;
  }

  public getSupplierId(): string {
    return this.supplierId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getExpiredDate(): Date {
    return this.expiredDate;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}

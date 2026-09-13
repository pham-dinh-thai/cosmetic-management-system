import { Batch } from './entities/batch.entity';

export type BatchProps = {
  id: string;
  lotNumber: string;
  supplierId: string;
  quantity: number;
  expiredDate: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FromPersistentInventoryProps = {
  id: string;
  variantId: string;
  batches: BatchProps[];
  minStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class Inventory {
  private constructor(
    private readonly id: string,
    private readonly variantId: string,
    private readonly batches: Batch[],
    private minStock: number,
    private isActive: boolean,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static fromPersistent(props: FromPersistentInventoryProps): Inventory {
    return new Inventory(
      props.id,
      props.variantId,
      props.batches.map((batch) => {
        return Batch.fromPersistent({
          ...batch,
          inventoryId: props.id,
        });
      }),
      props.minStock,
      props.isActive,
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

  public getVariantId(): string {
    return this.variantId;
  }

  public getBatches(): Batch[] {
    return [...this.batches];
  }

  public getMinStock(): number {
    return this.minStock;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}

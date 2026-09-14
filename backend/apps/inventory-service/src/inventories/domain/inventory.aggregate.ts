import { Batch } from './entities/batch.entity';
import { InactiveInventoryException } from './exceptions/inactive-inventory.exception';
import { Stock } from './value-objects/stock.value-object';

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

export type CreateInventoryProps = {
  variantId: string;
  minStock: number;
};

export type AddBatchProps = {
  lotNumber: string;
  supplierId: string;
  quantity: number;
  expiredDate: Date;
  createdBy: string;
};

export class Inventory {
  private constructor(
    private readonly id: string,
    private readonly variantId: string,
    private readonly batches: Batch[],
    private minStock: Stock,
    private isActive: boolean,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(props: CreateInventoryProps): Inventory {
    return new Inventory(
      undefined as unknown as string,
      props.variantId,
      [],
      Stock.create(props.minStock),
      true,
      new Date(),
      new Date(),
    );
  }

  public static fromPersistent(props: FromPersistentInventoryProps): Inventory {
    return new Inventory(
      props.id,
      props.variantId,
      props.batches.map((batch) => {
        return Batch.fromPersistent({
          ...batch,
        });
      }),
      Stock.fromPersistent(props.minStock),
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  public updateMinStock(newMinStock: number): void {
    if (!this.isActive) {
      throw new InactiveInventoryException(this.id);
    }

    this.minStock = Stock.create(newMinStock);
    this.updatedAt = new Date();
  }

  public addBatch(props: AddBatchProps): Batch {
    if (!this.isActive) {
      throw new InactiveInventoryException(this.id);
    }

    const batch = Batch.create({
      lotNumber: props.lotNumber,
      supplierId: props.supplierId,
      quantity: props.quantity,
      expiredDate: props.expiredDate,
      createdBy: props.createdBy,
    });

    this.batches.push(batch);

    this.updatedAt = new Date();

    return batch;
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public createNextLotNumber(): string {
    const maxSeq = this.batches.reduce((max, batch) => {
      const seq = Number(batch.getLotNumber().split('-').pop());
      return Number.isFinite(seq) && seq > max ? seq : max;
    }, 0);

    return `LOT-${this.variantId}-${maxSeq + 1}`;
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
    return this.minStock.getValue();
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

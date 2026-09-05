import { StockAdjustmentReason } from './types';

export type FromPersistentStockAdjustmentProps = {
  id: string;
  inventoryId: string;
  variantId: string;
  adjustment: number;
  reason: StockAdjustmentReason;
  note: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export class StockAdjustment {
  private constructor(
    private readonly id: string,
    private readonly inventoryId: string,
    private readonly variantId: string,
    private readonly adjustment: number,
    private readonly reason: StockAdjustmentReason,
    private readonly note: string | null,
    private readonly createdBy: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static fromPersistent(
    props: FromPersistentStockAdjustmentProps,
  ): StockAdjustment {
    return new StockAdjustment(
      props.id,
      props.inventoryId,
      props.variantId,
      props.adjustment,
      props.reason,
      props.note,
      props.createdBy,
      props.createdAt,
      props.updatedAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getInventoryId(): string {
    return this.inventoryId;
  }

  public getVariantId(): string {
    return this.variantId;
  }

  public getAdjustment(): number {
    return this.adjustment;
  }

  public getReason(): StockAdjustmentReason {
    return this.reason;
  }

  public getNote(): string | null {
    return this.note;
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

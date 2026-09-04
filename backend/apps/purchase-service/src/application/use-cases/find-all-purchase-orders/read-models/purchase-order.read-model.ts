import { PurchaseOrder } from '../../../../domain/purchase-order.aggregate';

export type PurchaseOrderLineReadModel = {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export class PurchaseOrderReadModel {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly supplierId: string,
    public readonly status: string,
    public readonly totalAmount: number,
    public readonly lines: PurchaseOrderLineReadModel[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static from(purchaseOrder: PurchaseOrder): PurchaseOrderReadModel {
    return new PurchaseOrderReadModel(
      purchaseOrder.getId(),
      purchaseOrder.getCode(),
      purchaseOrder.getSupplierId(),
      purchaseOrder.getStatus(),
      purchaseOrder.getTotalAmount(),
      purchaseOrder.getLines().map((line) => ({
        id: line.getId(),
        variantId: line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
        subtotal: line.getSubtotal(),
      })),
      purchaseOrder.getCreatedAt() ?? new Date(),
      purchaseOrder.getUpdatedAt() ?? new Date(),
    );
  }
}

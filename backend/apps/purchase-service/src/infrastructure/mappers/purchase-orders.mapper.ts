import { PurchaseOrder as PurchaseOrderDomain } from '../../domain/purchase-order.aggregate';
import { FromPersistentPurchaseOrderLineProps } from '../../domain/types';
import { PurchaseOrder as PurchaseOrderEntity } from '../entities/purchase-order.entity';

export class PurchaseOrdersMapper {
  public static toDomain(entity: PurchaseOrderEntity): PurchaseOrderDomain {
    const lines: FromPersistentPurchaseOrderLineProps[] = (
      entity.lines?.getItems?.() ?? []
    ).map((line) => ({
      id: line.id,
      purchaseOrderId: line.purchaseOrder.id,
      variantId: line.variantId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      createdAt: line.createdAt,
      updatedAt: line.updatedAt,
    }));

    return PurchaseOrderDomain.fromPersistent({
      id: entity.id,
      code: entity.code,
      supplierId: entity.supplierId,
      status: entity.status,
      totalAmount: entity.totalAmount,
      lines,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

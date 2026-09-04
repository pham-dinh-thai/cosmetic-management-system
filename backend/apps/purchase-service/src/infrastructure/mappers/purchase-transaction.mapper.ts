import { PurchaseTransaction as PurchaseTransactionDomain } from '../../domain/entities/purchase-transaction.entity';
import { FromPersistentPurchaseTransactionProps } from '../../domain/types';
import { PurchaseTransaction as PurchaseTransactionEntity } from '../entities/purchase-transaction.entity';

export class PurchaseTransactionMapper {
  public static toDomain(
    entity: PurchaseTransactionEntity,
  ): PurchaseTransactionDomain {
    return PurchaseTransactionDomain.fromPersistent({
      id: entity.id,
      purchaseOrderId: entity.purchaseOrder.id,
      variantId: entity.variantId,
      quantity: entity.quantity,
      unitPrice: entity.unitPrice,
      subtotal: entity.subtotal,
      employeeId: entity.employeeId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } satisfies FromPersistentPurchaseTransactionProps);
  }
}

import { OrderTransaction as OrderTransactionDomain } from '../../domain/entities/order-transaction.entity';
import { FromPersistentOrderTransactionProps } from '../../domain/types';
import { OrderTransaction as OrderTransactionEntity } from '../entities/order-transaction.entity';

export class OrderTransactionMapper {
  public static toDomain(
    entity: OrderTransactionEntity,
  ): OrderTransactionDomain {
    return OrderTransactionDomain.fromPersistent({
      id: entity.id,
      orderId: entity.order.id,
      variantId: entity.variantId,
      quantity: entity.quantity,
      unitPrice: entity.unitPrice,
      subtotal: entity.subtotal,
      employeeId: entity.employeeId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } satisfies FromPersistentOrderTransactionProps);
  }
}

import { Order as OrderDomain } from '../../domain/order.aggregate';
import { FromPersistentOrderLineProps } from '../../domain/types';
import { Order as OrderEntity } from '../entities/order.entity';

export class OrdersMapper {
  public static toDomain(entity: OrderEntity): OrderDomain {
    const lines: FromPersistentOrderLineProps[] = (
      entity.lines?.getItems?.() ?? []
    ).map((line) => ({
      id: line.id,
      orderId: line.order.id,
      variantId: line.variantId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      createdAt: line.createdAt,
      updatedAt: line.updatedAt,
    }));

    return OrderDomain.fromPersistent({
      id: entity.id,
      code: entity.code,
      customerId: entity.customerId,
      status: entity.status,
      totalAmount: entity.totalAmount,
      lines,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

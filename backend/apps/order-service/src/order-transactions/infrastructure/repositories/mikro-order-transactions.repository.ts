import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { OrderTransaction as OrderTransactionMikro } from 'apps/order-service/src/shared/infrastructure/entities/order-transaction.entity';
import { OrderTransaction } from 'apps/order-service/src/shared/domain/entities/order-transaction.entity';
import {
  FindOrderTransactionsFilters,
  IOrderTransactionsRepository,
  OrderTransactionProps,
} from 'apps/order-service/src/order-transactions/domain/repositories/order-transactions.repository';

@Injectable()
export class MikroOrderTransactionsRepository implements IOrderTransactionsRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async saveMany(transactions: OrderTransactionProps[]): Promise<void> {
    for (const transaction of transactions) {
      this.entityManager.create(OrderTransactionMikro, {
        order: {
          id: transaction.orderId,
        } as OrderTransactionMikro['order'],
        variantId: transaction.variantId,
        quantity: transaction.quantity,
        unitPrice: transaction.unitPrice,
        subtotal: transaction.quantity * transaction.unitPrice,
        employeeId: transaction.employeeId,
      });
    }

    await this.entityManager.flush();
  }

  public async findAll(
    filters?: FindOrderTransactionsFilters,
  ): Promise<OrderTransaction[]> {
    const where: Record<string, unknown> = {};

    if (filters?.orderId) {
      where.order = { id: filters.orderId };
    }

    if (filters?.variantId) {
      where.variantId = filters.variantId;
    }

    if (filters?.employeeId) {
      where.employeeId = filters.employeeId;
    }

    const entities = await this.entityManager.find(
      OrderTransactionMikro,
      where,
      { orderBy: { createdAt: 'DESC', id: 'DESC' } },
    );

    return entities.map((entity) => this.toDomain(entity));
  }

  private toDomain(entity: OrderTransactionMikro): OrderTransaction {
    return OrderTransaction.fromPersistent({
      id: entity.id,
      orderId: entity.order.id,
      variantId: entity.variantId,
      quantity: entity.quantity,
      unitPrice: entity.unitPrice,
      subtotal: entity.subtotal,
      employeeId: entity.employeeId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

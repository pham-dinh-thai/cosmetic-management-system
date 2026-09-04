import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { OrderTransaction as OrderTransactionDomain } from '../../domain/entities/order-transaction.entity';
import { IOrderTransactionsRepository } from '../../domain/repositories/order-transactions.repository';
import { OrderTransaction } from '../entities/order-transaction.entity';
import { OrderTransactionMapper } from '../mappers/order-transaction.mapper';

@Injectable()
export class MikroOrderTransactionsRepository implements IOrderTransactionsRepository {
  public constructor(private readonly em: EntityManager) {}

  public async saveMany(transactions: OrderTransactionDomain[]): Promise<void> {
    for (const transaction of transactions) {
      this.em.create(OrderTransaction, {
        order: {
          id: transaction.getOrderId(),
        } as OrderTransaction['order'],
        variantId: transaction.getVariantId(),
        quantity: transaction.getQuantity(),
        unitPrice: transaction.getUnitPrice(),
        subtotal: transaction.getSubtotal(),
        employeeId: transaction.getEmployeeId(),
      });
    }

    await this.em.flush();
  }

  public async findAll(options?: {
    orderId?: string;
    variantId?: string;
    employeeId?: string;
  }): Promise<OrderTransactionDomain[]> {
    const where: Record<string, unknown> = {};

    if (options?.orderId) {
      where.order = { id: options.orderId };
    }

    if (options?.variantId) {
      where.variantId = options.variantId;
    }

    if (options?.employeeId) {
      where.employeeId = options.employeeId;
    }

    const entities = await this.em.find(OrderTransaction, where, {
      orderBy: { createdAt: 'DESC' },
    });

    return entities.map((entity) => OrderTransactionMapper.toDomain(entity));
  }
}

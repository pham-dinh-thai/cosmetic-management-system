import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { PurchaseTransaction as PurchaseTransactionDomain } from '../../domain/entities/purchase-transaction.entity';
import { IPurchaseTransactionsRepository } from '../../domain/repositories/purchase-transactions.repository';
import { PurchaseTransaction } from '../entities/purchase-transaction.entity';
import { PurchaseTransactionMapper } from '../mappers/purchase-transaction.mapper';

@Injectable()
export class MikroPurchaseTransactionsRepository implements IPurchaseTransactionsRepository {
  public constructor(private readonly em: EntityManager) {}

  public async saveMany(
    transactions: PurchaseTransactionDomain[],
  ): Promise<void> {
    for (const transaction of transactions) {
      this.em.create(PurchaseTransaction, {
        purchaseOrder: {
          id: transaction.getPurchaseOrderId(),
        } as PurchaseTransaction['purchaseOrder'],
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
    purchaseOrderId?: string;
    variantId?: string;
    employeeId?: string;
  }): Promise<PurchaseTransactionDomain[]> {
    const where: Record<string, unknown> = {};

    if (options?.purchaseOrderId) {
      where.purchaseOrder = { id: options.purchaseOrderId };
    }

    if (options?.variantId) {
      where.variantId = options.variantId;
    }

    if (options?.employeeId) {
      where.employeeId = options.employeeId;
    }

    const entities = await this.em.find(PurchaseTransaction, where, {
      orderBy: { createdAt: 'DESC' },
    });

    return entities.map((entity) => PurchaseTransactionMapper.toDomain(entity));
  }
}

import { EntityManager } from '@mikro-orm/postgresql';
import { IPurchaseOrdersRepository } from '../../domain/repositories/purchase-orders.repository';
import { PurchaseOrder as PurchaseOrderDomain } from '../../domain/purchase-order.aggregate';
import {
  CreatePurchaseOrderLineProps,
  PurchaseOrderStatus,
} from '../../domain/types';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderLine } from '../entities/purchase-order-line.entity';
import { PurchaseOrdersMapper } from '../mappers/purchase-orders.mapper';

export class MikroPurchaseOrdersRepository implements IPurchaseOrdersRepository {
  private readonly em: EntityManager;

  public constructor(em: EntityManager) {
    this.em = em;
  }

  public async findAll(options?: {
    search?: string;
    status?: PurchaseOrderStatus;
    supplierId?: string;
  }): Promise<PurchaseOrderDomain[]> {
    const where: Record<string, unknown> = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.search) {
      where.code = { $ilike: `%${options.search}%` };
    }

    if (options?.supplierId) {
      where.supplierId = options.supplierId;
    }

    const entities = await this.em.find(PurchaseOrder, where, {
      populate: ['lines'],
      orderBy: { createdAt: 'DESC' },
    });

    return entities.map((entity) => PurchaseOrdersMapper.toDomain(entity));
  }

  public async findById(id: string): Promise<PurchaseOrderDomain | null> {
    const entity = await this.em.findOne(
      PurchaseOrder,
      { id },
      { populate: ['lines'] },
    );

    return entity ? PurchaseOrdersMapper.toDomain(entity) : null;
  }

  public async count(): Promise<number> {
    return this.em.count(PurchaseOrder);
  }

  public async create(
    purchaseOrder: PurchaseOrderDomain,
  ): Promise<{ id: string }> {
    const entity = this.em.create(PurchaseOrder, {
      code: purchaseOrder.getCode(),
      supplierId: purchaseOrder.getSupplierId(),
      status: purchaseOrder.getStatus(),
      totalAmount: purchaseOrder.getTotalAmount(),
    });

    this.em.persist(entity);
    await this.em.flush();

    for (const line of purchaseOrder.getLines()) {
      const lineEntity = this.em.create(PurchaseOrderLine, {
        purchaseOrder: entity,
        variantId: line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
      });
      entity.lines.add(lineEntity);
    }

    await this.em.flush();

    return { id: entity.id };
  }

  public async replaceLines(
    id: string,
    lines: CreatePurchaseOrderLineProps[],
  ): Promise<PurchaseOrderDomain | null> {
    const entity = await this.em.findOne(
      PurchaseOrder,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    entity.lines.removeAll();
    await this.em.flush();

    for (const line of lines) {
      const lineEntity = this.em.create(PurchaseOrderLine, {
        purchaseOrder: entity,
        variantId: line.variantId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      });
      entity.lines.add(lineEntity);
    }

    entity.totalAmount = lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0,
    );

    await this.em.flush();

    return PurchaseOrdersMapper.toDomain(entity);
  }

  public async setStatus(
    id: string,
    status: PurchaseOrderStatus,
  ): Promise<PurchaseOrderDomain | null> {
    const entity = await this.em.findOne(
      PurchaseOrder,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    entity.status = status;
    await this.em.flush();

    return PurchaseOrdersMapper.toDomain(entity);
  }

  public async delete(id: string): Promise<PurchaseOrderDomain | null> {
    const entity = await this.em.findOne(
      PurchaseOrder,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    await this.em.remove(entity).flush();

    return PurchaseOrdersMapper.toDomain(entity);
  }
}

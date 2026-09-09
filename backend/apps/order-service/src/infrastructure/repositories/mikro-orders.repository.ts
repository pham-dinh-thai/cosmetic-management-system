import { Injectable } from '@nestjs/common';
import { EntityManager, raw } from '@mikro-orm/postgresql';
import { IOrdersRepository } from '../../domain/repositories/orders.repository';
import { Order as OrderDomain } from '../../domain/order.aggregate';
import { CreateOrderLineProps, OrderStatus } from '../../domain/types';
import { Order } from '../entities/order.entity';
import { OrderLine } from '../entities/order-line.entity';
import { OrdersMapper } from '../mappers/orders.mapper';
import { ORDER_CODE_PREFIX } from '../../domain/value-objects/order-code.value-object';
import { maxSequenceFromCodes } from '@app/codes';

@Injectable()
export class MikroOrdersRepository implements IOrdersRepository {
  private readonly em: EntityManager;

  public constructor(em: EntityManager) {
    this.em = em;
  }

  public async findAll(options?: {
    search?: string;
    status?: OrderStatus;
    customerId?: string;
  }): Promise<OrderDomain[]> {
    const where: Record<string, unknown> = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.search) {
      where.code = { $ilike: `%${options.search}%` };
    }

    if (options?.customerId) {
      where.customerId = options.customerId;
    }

    const entities = await this.em.find(Order, where, {
      populate: ['lines'],
      orderBy: { createdAt: 'DESC' },
    });

    return entities.map((entity) => OrdersMapper.toDomain(entity));
  }

  public async findById(id: string): Promise<OrderDomain | null> {
    const entity = await this.em.findOne(
      Order,
      { id },
      { populate: ['lines'] },
    );

    return entity ? OrdersMapper.toDomain(entity) : null;
  }

  public async findMaxCodeSequence(): Promise<number | null> {
    const entities = await this.em.find(
      Order,
      {},
      { fields: ['code'], orderBy: { code: 'DESC' }, limit: 1 },
    );

    if (entities.length === 0) {
      return null;
    }

    return maxSequenceFromCodes(ORDER_CODE_PREFIX, [entities[0].code]);
  }

  public async create(order: OrderDomain): Promise<{ id: string }> {
    const entity = this.em.create(Order, {
      code: order.getCode(),
      customerId: order.getCustomerId(),
      status: order.getStatus(),
      totalAmount: order.getTotalAmount(),
    });

    this.em.persist(entity);
    await this.em.flush();

    for (const line of order.getLines()) {
      const lineEntity = this.em.create(OrderLine, {
        order: entity,
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
    lines: CreateOrderLineProps[],
  ): Promise<OrderDomain | null> {
    const entity = await this.em.findOne(
      Order,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    entity.lines.removeAll();
    await this.em.flush();

    for (const line of lines) {
      const lineEntity = this.em.create(OrderLine, {
        order: entity,
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

    return OrdersMapper.toDomain(entity);
  }

  public async setStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderDomain | null> {
    const entity = await this.em.findOne(
      Order,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    entity.status = status;
    await this.em.flush();

    return OrdersMapper.toDomain(entity);
  }

  public async findBestSellers(
    limit: number,
  ): Promise<{ variantId: string; quantitySold: number }[]> {
    const rows = await this.em
      .createQueryBuilder(OrderLine, 'ol')
      .join('ol.order', 'o')
      .select('ol.variantId')
      .addSelect(raw('SUM(ol.quantity)').as('total'))
      .where({ 'o.status': { $ne: OrderStatus.CANCELLED } })
      .groupBy('ol.variantId')
      .orderBy({ [raw('SUM(ol.quantity)')]: 'DESC' })
      .limit(limit)
      .execute();

    return rows.map((row: Record<string, unknown>) => ({
      variantId: String(row.variantId),
      quantitySold: Number(row.total),
    }));
  }

  public async findVariantIdsWithOrders(
    variantIds: string[],
  ): Promise<string[]> {
    if (variantIds.length === 0) {
      return [];
    }

    const rows = await this.em
      .createQueryBuilder(OrderLine, 'ol')
      .join('ol.order', 'o')
      .select('ol.variantId')
      .where({
        'ol.variantId': { $in: variantIds },
        'o.status': { $ne: OrderStatus.CANCELLED },
      })
      .distinct()
      .execute();

    return rows.map((row: Record<string, unknown>) => String(row.variantId));
  }

  public async delete(id: string): Promise<OrderDomain | null> {
    const entity = await this.em.findOne(
      Order,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    await this.em.remove(entity).flush();

    return OrdersMapper.toDomain(entity);
  }
}

import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IOrdersRepository } from '../../domain/repositories/orders.repository';
import { Order as OrderDomain } from '../../domain/order.aggregate';
import { CreateOrderLineProps, OrderStatus } from '../../domain/types';
import { Order } from '../entities/order.entity';
import { OrderLine } from '../entities/order-line.entity';
import { OrdersMapper } from '../mappers/orders.mapper';

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

  public async count(): Promise<number> {
    return this.em.count(Order);
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

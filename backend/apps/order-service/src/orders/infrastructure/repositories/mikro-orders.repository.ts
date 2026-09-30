import { Injectable } from '@nestjs/common';
import { EntityManager, raw } from '@mikro-orm/postgresql';
import {
  BestSellerRow,
  IOrdersRepository,
  OrderListFilters,
} from '../../domain/repositories/orders.repository';
import { Order as OrderMikro } from 'apps/order-service/src/shared/infrastructure/entities/order.entity';
import { OrderLine as OrderLineMikro } from 'apps/order-service/src/shared/infrastructure/entities/order-line.entity';
import { Order } from '../../../shared/domain/order.aggregate';
import { CreateOrderLineProps } from '../../../shared/domain/order.aggregate';
import { OrderStatus } from '../../../shared/domain/enums/order-status.enum';
import { OrderPaymentStatus } from '../../../shared/domain/enums/order-payment-status.enum';

@Injectable()
export class MikroOrdersRepository implements IOrdersRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findPage(
    offset: number,
    limit: number,
    filters?: OrderListFilters,
  ): Promise<Order[]> {
    const entities = await this.entityManager.find(
      OrderMikro,
      this.buildWhere(filters),
      {
        populate: ['lines'],
        limit,
        offset,
        orderBy: { createdAt: 'DESC', id: 'DESC' },
      },
    );

    return entities.map((orderMikro) => this.toDomain(orderMikro));
  }

  public async count(filters?: OrderListFilters): Promise<number> {
    return this.entityManager.count(OrderMikro, this.buildWhere(filters));
  }

  public async findAll(filters?: OrderListFilters): Promise<Order[]> {
    const entities = await this.entityManager.find(
      OrderMikro,
      this.buildWhere(filters),
      {
        populate: ['lines'],
        orderBy: { createdAt: 'DESC', id: 'DESC' },
      },
    );

    return entities.map((orderMikro) => this.toDomain(orderMikro));
  }

  public async findById(id: string): Promise<Order | null> {
    const orderMikro = await this.entityManager.findOne(
      OrderMikro,
      { id },
      { populate: ['lines'] },
    );

    return orderMikro ? this.toDomain(orderMikro) : null;
  }

  public async updateStatus(order: Order): Promise<void> {
    await this.entityManager.nativeUpdate(
      OrderMikro,
      { id: order.getId() },
      { status: order.getStatus(), updatedAt: order.getUpdatedAt() },
    );
  }

  public async replaceLines(
    id: string,
    lines: CreateOrderLineProps[],
  ): Promise<Order | null> {
    const entity = await this.entityManager.findOne(
      OrderMikro,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    entity.lines.removeAll();
    await this.entityManager.flush();

    for (const line of lines) {
      const lineEntity = this.entityManager.create(OrderLineMikro, {
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

    await this.entityManager.flush();

    return this.toDomain(entity);
  }

  public async setStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order | null> {
    const entity = await this.entityManager.findOne(
      OrderMikro,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    entity.status = status;
    await this.entityManager.flush();

    return this.toDomain(entity);
  }

  public async setPaymentStatus(
    id: string,
    paymentStatus: OrderPaymentStatus,
  ): Promise<Order | null> {
    const entity = await this.entityManager.findOne(
      OrderMikro,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    entity.paymentStatus = paymentStatus;
    await this.entityManager.flush();

    return this.toDomain(entity);
  }

  public async delete(id: string): Promise<Order | null> {
    const entity = await this.entityManager.findOne(
      OrderMikro,
      { id },
      { populate: ['lines'] },
    );

    if (!entity) {
      return null;
    }

    await this.entityManager.remove(entity).flush();

    return this.toDomain(entity);
  }

  public async findBestSellers(limit: number): Promise<BestSellerRow[]> {
    const rows = await this.entityManager
      .createQueryBuilder(OrderLineMikro, 'ol')
      .join('ol.order', 'o')
      .select('ol.variantId')
      .addSelect(raw('SUM(ol.quantity)').as('total'))
      .where({
        'o.status': { $in: [OrderStatus.DELIVERED, OrderStatus.COMPLETED] },
      })
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

    const rows = await this.entityManager
      .createQueryBuilder(OrderLineMikro, 'ol')
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

  private buildWhere(filters?: OrderListFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.code = { $ilike: `%${filters.search}%` };
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    return where;
  }

  private toDomain(orderMikro: OrderMikro): Order {
    return Order.fromPersistent({
      id: orderMikro.id,
      code: orderMikro.code,
      customerId: orderMikro.customerId,
      paymentMethod: orderMikro.paymentMethod,
      paymentStatus: orderMikro.paymentStatus,
      status: orderMikro.status,
      totalAmount: orderMikro.totalAmount,
      lines: orderMikro.lines.map((orderLineMikro) => ({
        id: orderLineMikro.id,
        variantId: orderLineMikro.variantId,
        quantity: orderLineMikro.quantity,
        unitPrice: orderLineMikro.unitPrice,
        createdAt: orderLineMikro.createdAt,
        updatedAt: orderLineMikro.updatedAt,
      })),
      recipientName: orderMikro.recipientName ?? null,
      recipientPhone: orderMikro.recipientPhone ?? null,
      shippingAddress: orderMikro.shippingAddress ?? null,
      shippingCity: orderMikro.shippingCity ?? null,
      createdAt: orderMikro.createdAt,
      updatedAt: orderMikro.updatedAt,
    });
  }
}

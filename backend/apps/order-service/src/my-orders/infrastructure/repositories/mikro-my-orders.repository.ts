import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IMyOrdersRepository } from '../../domain/repositories/my-orders.repository';
import { Order as OrderMikro } from 'apps/order-service/src/shared/infrastructure/entities/order.entity';
import { OrderLine as OrderLineMikro } from 'apps/order-service/src/shared/infrastructure/entities/order-line.entity';
import { Order } from '../../../orders/domain/order.aggregate';
import { ORDER_CODE_PREFIX } from '../../../orders/domain/value-objects/order-code.value-object';
import { maxSequenceFromCodes } from '@app/codes';

@Injectable()
export class MikroMyOrdersRepository implements IMyOrdersRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async create(order: Order): Promise<{ id: string }> {
    const entity = this.entityManager.create(OrderMikro, {
      code: order.getCode(),
      customerId: order.getCustomerId(),
      paymentMethod: order.getPaymentMethod(),
      paymentStatus: order.getPaymentStatus(),
      status: order.getStatus(),
      totalAmount: order.getTotalAmount(),
      recipientName: order.getRecipientName(),
      recipientPhone: order.getRecipientPhone(),
      shippingAddress: order.getShippingAddress(),
      shippingCity: order.getShippingCity(),
    });

    this.entityManager.persist(entity);
    await this.entityManager.flush();

    for (const line of order.getLines()) {
      const lineEntity = this.entityManager.create(OrderLineMikro, {
        order: entity,
        variantId: line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
      });
      entity.lines.add(lineEntity);
    }

    await this.entityManager.flush();

    return { id: entity.id };
  }

  public async findMaxCodeSequence(): Promise<number | null> {
    const entities = await this.entityManager.find(
      OrderMikro,
      {},
      { fields: ['code'], orderBy: { code: 'DESC' }, limit: 1 },
    );

    if (entities.length === 0) {
      return null;
    }

    return maxSequenceFromCodes(ORDER_CODE_PREFIX, [entities[0].code]);
  }

  public async findById(id: string): Promise<Order | null> {
    const orderMikro = await this.entityManager.findOne(
      OrderMikro,
      { id },
      { populate: ['lines'] },
    );

    return orderMikro ? this.toDomain(orderMikro) : null;
  }

  public async findAllByCustomer(customerId: string): Promise<Order[]> {
    const entities = await this.entityManager.find(
      OrderMikro,
      { customerId },
      {
        populate: ['lines'],
        orderBy: { createdAt: 'DESC', id: 'DESC' },
      },
    );

    return entities.map((orderMikro) => this.toDomain(orderMikro));
  }

  public async updateStatus(order: Order): Promise<void> {
    await this.entityManager.nativeUpdate(
      OrderMikro,
      { id: order.getId() },
      { status: order.getStatus(), updatedAt: order.getUpdatedAt() },
    );
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

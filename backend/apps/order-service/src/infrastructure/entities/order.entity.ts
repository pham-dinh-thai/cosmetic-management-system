import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { OrderLine } from './order-line.entity';
import { OrderStatus } from '../../domain/types';

const OrderSchema = defineEntity({
  name: 'Order',
  tableName: 'orders',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    customerId: p.string().fieldName('customer_id'),
    status: p.enum(OrderStatus).default(OrderStatus.PENDING),
    totalAmount: p
      .decimal('number')
      .precision(12)
      .scale(2)
      .fieldName('total_amount')
      .default(0),
    lines: () => p.oneToMany(OrderLine).mappedBy('order'),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .fieldName('updated_at')
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Order extends OrderSchema.class {
  [OptionalProps]?: 'status' | 'totalAmount' | 'createdAt' | 'updatedAt';
}

OrderSchema.setClass(Order);

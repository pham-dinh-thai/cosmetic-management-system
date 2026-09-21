import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { OrderLine } from './order-line.entity';
import {
  OrderStatus,
  OrderPaymentMethod,
  OrderPaymentStatus,
} from '../../domain/types';

const OrderSchema = defineEntity({
  name: 'Order',
  tableName: 'orders',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    customerId: p.string().fieldName('customer_id'),
    paymentMethod: p
      .enum(OrderPaymentMethod)
      .fieldName('payment_method')
      .default(OrderPaymentMethod.CASH),
    paymentStatus: p
      .enum(OrderPaymentStatus)
      .fieldName('payment_status')
      .default(OrderPaymentStatus.UNPAID),
    status: p.enum(OrderStatus).default(OrderStatus.PENDING_CONFIRMATION),
    totalAmount: p
      .decimal('number')
      .precision(12)
      .scale(2)
      .fieldName('total_amount')
      .default(0),
    recipientName: p.string().nullable().fieldName('recipient_name'),
    recipientPhone: p.string().nullable().fieldName('recipient_phone'),
    shippingAddress: p.string().nullable().fieldName('shipping_address'),
    shippingCity: p.string().nullable().fieldName('shipping_city'),
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
  [OptionalProps]?:
    | 'paymentMethod'
    | 'paymentStatus'
    | 'status'
    | 'totalAmount'
    | 'createdAt'
    | 'updatedAt';
}

OrderSchema.setClass(Order);

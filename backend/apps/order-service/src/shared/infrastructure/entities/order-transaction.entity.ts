import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Order } from './order.entity';

const OrderTransactionSchema = defineEntity({
  name: 'OrderTransaction',
  tableName: 'order_transactions',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    order: () => p.manyToOne(Order).fieldName('order_id').deleteRule('cascade'),
    variantId: p.string().fieldName('variant_id'),
    quantity: p.integer().default(1),
    unitPrice: p
      .decimal('number')
      .precision(12)
      .scale(2)
      .fieldName('unit_price'),
    subtotal: p.decimal('number').precision(12).scale(2).default(0),
    employeeId: p.string().fieldName('employee_id'),
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

export class OrderTransaction extends OrderTransactionSchema.class {
  [OptionalProps]?: 'quantity' | 'subtotal' | 'createdAt' | 'updatedAt';
}

OrderTransactionSchema.setClass(OrderTransaction);

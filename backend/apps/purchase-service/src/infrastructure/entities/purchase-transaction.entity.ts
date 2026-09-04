import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { PurchaseOrder } from './purchase-order.entity';

const PurchaseTransactionSchema = defineEntity({
  name: 'PurchaseTransaction',
  tableName: 'purchase_transactions',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    purchaseOrder: () =>
      p
        .manyToOne(PurchaseOrder)
        .fieldName('purchase_order_id')
        .deleteRule('cascade'),
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

export class PurchaseTransaction extends PurchaseTransactionSchema.class {
  [OptionalProps]?: 'quantity' | 'subtotal' | 'createdAt' | 'updatedAt';
}

PurchaseTransactionSchema.setClass(PurchaseTransaction);

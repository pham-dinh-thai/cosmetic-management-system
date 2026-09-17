import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { PaymentCategory, PaymentSource } from '../../domain/types';

const PaymentSchema = defineEntity({
  name: 'Payment',
  tableName: 'payments',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    amount: p
      .decimal('number')
      .precision(12)
      .scale(2)
      .default(0),
    category: p.enum(PaymentCategory).default(PaymentCategory.OTHER),
    source: p.enum(PaymentSource).default(PaymentSource.MANUAL),
    purchaseOrderId: p.string().fieldName('purchase_order_id').nullable(),
    supplierId: p.string().fieldName('supplier_id').nullable(),
    note: p.string().nullable(),
    employeeId: p.string().fieldName('employee_id').nullable(),
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

export class Payment extends PaymentSchema.class {
  [OptionalProps]?:
    | 'category'
    | 'source'
    | 'note'
    | 'employeeId'
    | 'createdAt'
    | 'updatedAt';
}

PaymentSchema.setClass(Payment);
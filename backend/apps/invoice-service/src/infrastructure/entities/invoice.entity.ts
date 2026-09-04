import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { InvoiceStatus } from '../../domain/types';

const InvoiceSchema = defineEntity({
  name: 'Invoice',
  tableName: 'invoices',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    orderId: p.string().unique().fieldName('order_id'),
    customerId: p.string().fieldName('customer_id'),
    totalAmount: p
      .decimal('number')
      .precision(12)
      .scale(2)
      .fieldName('total_amount')
      .default(0),
    paidAmount: p
      .decimal('number')
      .precision(12)
      .scale(2)
      .fieldName('paid_amount')
      .default(0),
    status: p.enum(InvoiceStatus).default(InvoiceStatus.UNPAID),
    note: p.string().nullable(),
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

export class Invoice extends InvoiceSchema.class {
  [OptionalProps]?:
    'paidAmount' | 'status' | 'note' | 'createdAt' | 'updatedAt';
}

InvoiceSchema.setClass(Invoice);

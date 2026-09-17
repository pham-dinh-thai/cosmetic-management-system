import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { ReceiptSource } from '../../domain/types';

const ReceiptSchema = defineEntity({
  name: 'Receipt',
  tableName: 'receipts',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    amount: p
      .decimal('number')
      .precision(12)
      .scale(2)
      .default(0),
    source: p.enum(ReceiptSource).default(ReceiptSource.MANUAL),
    invoiceId: p.string().fieldName('invoice_id').nullable(),
    customerId: p.string().fieldName('customer_id').nullable(),
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

export class Receipt extends ReceiptSchema.class {
  [OptionalProps]?:
    | 'source'
    | 'note'
    | 'employeeId'
    | 'createdAt'
    | 'updatedAt';
}

ReceiptSchema.setClass(Receipt);
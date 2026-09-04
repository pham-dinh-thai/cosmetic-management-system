import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { PurchaseOrderLine } from './purchase-order-line.entity';
import { PurchaseOrderStatus } from '../../domain/types';

const PurchaseOrderSchema = defineEntity({
  name: 'PurchaseOrder',
  tableName: 'purchase_orders',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    code: p.string().unique(),
    supplierId: p.string().fieldName('supplier_id'),
    status: p.enum(PurchaseOrderStatus).default(PurchaseOrderStatus.PENDING),
    totalAmount: p
      .decimal('number')
      .precision(12)
      .scale(2)
      .fieldName('total_amount')
      .default(0),
    lines: () => p.oneToMany(PurchaseOrderLine).mappedBy('purchaseOrder'),
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

export class PurchaseOrder extends PurchaseOrderSchema.class {
  [OptionalProps]?: 'status' | 'totalAmount' | 'createdAt' | 'updatedAt';
}

PurchaseOrderSchema.setClass(PurchaseOrder);

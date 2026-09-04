import { PurchaseOrder } from '../purchase-order.aggregate';
import { CreatePurchaseOrderLineProps, PurchaseOrderStatus } from '../types';

export interface IPurchaseOrdersRepository {
  findAll(options?: {
    search?: string;
    status?: PurchaseOrderStatus;
    supplierId?: string;
  }): Promise<PurchaseOrder[]>;

  findById(id: string): Promise<PurchaseOrder | null>;

  count(): Promise<number>;

  create(purchaseOrder: PurchaseOrder): Promise<{ id: string }>;

  replaceLines(
    id: string,
    lines: CreatePurchaseOrderLineProps[],
  ): Promise<PurchaseOrder | null>;

  setStatus(
    id: string,
    status: PurchaseOrderStatus,
  ): Promise<PurchaseOrder | null>;

  delete(id: string): Promise<PurchaseOrder | null>;
}

export const PURCHASE_ORDERS_REPOSITORY = 'IPurchaseOrdersRepository';

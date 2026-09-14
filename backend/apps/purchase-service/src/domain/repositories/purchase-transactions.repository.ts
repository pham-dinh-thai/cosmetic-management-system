import { PurchaseTransaction } from '../entities/purchase-transaction.entity';

export interface IPurchaseTransactionsRepository {
  saveMany(transactions: PurchaseTransaction[]): Promise<void>;
  findAll(options?: {
    purchaseOrderId?: string;
    variantId?: string;
    employeeId?: string;
  }): Promise<PurchaseTransaction[]>;
  existsByPurchaseOrderId(purchaseOrderId: string): Promise<boolean>;
}

export const PURCHASE_TRANSACTIONS_REPOSITORY =
  'IPurchaseTransactionsRepository';

import { OrderTransaction } from 'apps/order-service/src/shared/domain/entities/order-transaction.entity';

export type OrderTransactionProps = {
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  employeeId: string;
};

export type FindOrderTransactionsFilters = {
  orderId?: string;
  variantId?: string;
  employeeId?: string;
};

export interface IOrderTransactionsRepository {
  saveMany(transactions: OrderTransactionProps[]): Promise<void>;
  findAll(filters?: FindOrderTransactionsFilters): Promise<OrderTransaction[]>;
}

export const ORDER_TRANSACTIONS_REPOSITORY = 'IOrderTransactionsRepository';

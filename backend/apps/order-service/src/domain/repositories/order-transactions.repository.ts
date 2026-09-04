import { OrderTransaction } from '../entities/order-transaction.entity';

export interface IOrderTransactionsRepository {
  saveMany(transactions: OrderTransaction[]): Promise<void>;
  findAll(options?: {
    orderId?: string;
    variantId?: string;
    employeeId?: string;
  }): Promise<OrderTransaction[]>;
}

export const ORDER_TRANSACTIONS_REPOSITORY = 'IOrderTransactionsRepository';

import { Order } from '../../../orders/domain/order.aggregate';

export interface IMyOrdersRepository {
  create(order: Order): Promise<{ id: string }>;
  findMaxCodeSequence(): Promise<number | null>;
  findById(id: string): Promise<Order | null>;
  findAllByCustomer(customerId: string): Promise<Order[]>;
  updateStatus(order: Order): Promise<void>;
}

export const MY_ORDERS_REPOSITORY = 'IMyOrdersRepository';

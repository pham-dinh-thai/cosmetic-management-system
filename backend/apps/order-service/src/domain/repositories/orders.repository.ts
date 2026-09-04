import { Order } from '../order.aggregate';
import { CreateOrderLineProps, OrderStatus } from '../types';

export interface IOrdersRepository {
  findAll(options?: {
    search?: string;
    status?: OrderStatus;
    customerId?: string;
  }): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  count(): Promise<number>;
  create(order: Order): Promise<{ id: string }>;
  replaceLines(
    id: string,
    lines: CreateOrderLineProps[],
  ): Promise<Order | null>;
  setStatus(id: string, status: OrderStatus): Promise<Order | null>;
  delete(id: string): Promise<Order | null>;
}

export const ORDERS_REPOSITORY = 'IOrdersRepository';

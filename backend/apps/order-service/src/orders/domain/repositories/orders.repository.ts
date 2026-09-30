import { OrderStatus } from '../../../shared/domain/enums/order-status.enum';
import { Order } from '../../../shared/domain/order.aggregate';
import { CreateOrderLineProps } from '../../../shared/domain/order.aggregate';
import { OrderPaymentStatus } from '../../../shared/domain/enums/order-payment-status.enum';

export type OrderListFilters = {
  search?: string;
  status?: OrderStatus;
  customerId?: string;
};

export type BestSellerRow = {
  variantId: string;
  quantitySold: number;
};

export interface IOrdersRepository {
  findPage(
    offset: number,
    limit: number,
    filters?: OrderListFilters,
  ): Promise<Order[]>;

  count(filters?: OrderListFilters): Promise<number>;

  findAll(filters?: OrderListFilters): Promise<Order[]>;

  findById(id: string): Promise<Order | null>;

  updateStatus(order: Order): Promise<void>;

  replaceLines(
    id: string,
    lines: CreateOrderLineProps[],
  ): Promise<Order | null>;

  setStatus(id: string, status: OrderStatus): Promise<Order | null>;

  setPaymentStatus(
    id: string,
    paymentStatus: OrderPaymentStatus,
  ): Promise<Order | null>;

  delete(id: string): Promise<Order | null>;

  findBestSellers(limit: number): Promise<BestSellerRow[]>;

  findVariantIdsWithOrders(variantIds: string[]): Promise<string[]>;
}

export const ORDERS_REPOSITORY = 'IOrdersRepository';

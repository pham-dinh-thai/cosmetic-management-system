import { CreateOrderLineProps } from '../../../domain/types';

export interface IUpdateOrderRequest {
  lines: CreateOrderLineProps[];
}

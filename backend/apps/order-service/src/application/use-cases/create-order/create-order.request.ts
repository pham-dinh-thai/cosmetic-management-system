import { CreateOrderLineProps } from '../../../domain/types';

export interface ICreateOrderRequest {
  customerId: string;
  lines: CreateOrderLineProps[];
}

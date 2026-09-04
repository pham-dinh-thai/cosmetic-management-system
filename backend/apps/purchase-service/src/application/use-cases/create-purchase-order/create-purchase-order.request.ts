import { CreatePurchaseOrderLineProps } from '../../../domain/types';

export interface ICreatePurchaseOrderRequest {
  supplierId: string;
  lines: CreatePurchaseOrderLineProps[];
}

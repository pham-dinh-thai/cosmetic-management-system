import { CreatePurchaseOrderLineProps } from '../../../domain/types';

export interface IUpdatePurchaseOrderRequest {
  supplierId?: string;
  lines: CreatePurchaseOrderLineProps[];
}

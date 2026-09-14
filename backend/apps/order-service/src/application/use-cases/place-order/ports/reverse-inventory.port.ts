import { BatchDeduction } from 'apps/order-service/src/domain/ports/remove-stock.port';

export interface IReverseInventoryPort {
  execute(
    variantId: string,
    quantity: number,
    deductions: BatchDeduction[],
  ): Promise<void>;
}

export const REVERSE_INVENTORY_PORT = 'IReverseInventoryPort';

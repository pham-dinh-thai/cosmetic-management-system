import { BatchDeduction } from './remove-stock.port';

export interface IReverseInventoryPort {
  execute(
    variantId: string,
    quantity: number,
    deductions: BatchDeduction[],
  ): Promise<void>;
}

export const REVERSE_INVENTORY_PORT = 'IReverseInventoryPort';

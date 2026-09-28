export interface IRestoreStockPort {
  execute(variantId: string, quantity: number): Promise<void>;
}

export const RESTORE_STOCK_PORT = 'IRestoreStockPort';

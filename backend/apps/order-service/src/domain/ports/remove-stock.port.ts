export interface IRemoveStockPort {
  execute(variantId: string, quantity: number): Promise<void>;
}

export const REMOVE_STOCK_PORT = 'IRemoveStockPort';

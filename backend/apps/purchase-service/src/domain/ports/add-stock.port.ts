export interface IAddStockPort {
  execute(variantId: string, quantity: number): Promise<void>;
}

export const ADD_STOCK_PORT = 'IAddStockPort';

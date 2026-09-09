export interface IAddStockPort {
  execute(
    variantId: string,
    quantity: number,
    createdBy?: string,
  ): Promise<void>;
}

export const ADD_STOCK_PORT = 'IAddStockPort';

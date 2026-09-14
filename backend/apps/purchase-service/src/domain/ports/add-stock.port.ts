export interface IAddStockPort {
  execute(
    variantId: string,
    quantity: number,
    supplierId: string,
    expiredDate: Date,
    createdBy?: string,
  ): Promise<void>;
}

export const ADD_STOCK_PORT = 'IAddStockPort';

export type StockOperationResult = {
  batchId: string;
};

export interface IAddStockPort {
  execute(
    variantId: string,
    quantity: number,
    supplierId: string,
    expiredDate: Date,
    createdBy?: string,
  ): Promise<StockOperationResult>;
  reverse(
    variantId: string,
    deductions: { batchId: string; quantity: number }[],
  ): Promise<void>;
}

export const ADD_STOCK_PORT = 'IAddStockPort';

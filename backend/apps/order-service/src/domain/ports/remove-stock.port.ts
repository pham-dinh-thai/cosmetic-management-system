export type BatchDeduction = {
  batchId: string;
  quantity: number;
};

export interface IRemoveStockPort {
  execute(
    variantId: string,
    quantity: number,
  ): Promise<BatchDeduction[]>;
}

export const REMOVE_STOCK_PORT = 'IRemoveStockPort';

export interface IDecreaseCartLineRequest {
  variantId: string;
  quantity: number;
}

export interface IDecreaseCartLineQuantityPort {
  execute(customerId: string, lines: IDecreaseCartLineRequest[]): Promise<void>;
}

export const DECREASE_CART_LINE_QUANTITY_PORT = 'IDecreaseCartLineQuantityPort';

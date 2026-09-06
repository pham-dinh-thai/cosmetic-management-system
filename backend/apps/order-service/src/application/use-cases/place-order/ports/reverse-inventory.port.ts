export interface IReverseInventoryPort {
  execute(variantId: string, quantity: number): Promise<void>;
}

export const REVERSE_INVENTORY_PORT = 'IReverseInventoryPort';

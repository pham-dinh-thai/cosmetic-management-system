export enum CartStatus {
  OPEN = 'OPEN',
  CHECKED_OUT = 'CHECKED_OUT',
}

export type CartItemProps = {
  variantId: string;
  quantity: number;
};

export type CreateCartProps = {
  customerId: string;
};

export type FromPersistentCartProps = {
  id: string;
  customerId: string;
  status: CartStatus;
  items: CartItemProps[];
  createdAt?: Date;
  updatedAt?: Date;
};

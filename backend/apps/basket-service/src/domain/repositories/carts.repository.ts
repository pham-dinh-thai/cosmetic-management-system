import { Cart } from '../cart.aggregate';

export interface ICartsRepository {
  findByCustomerId(customerId: string): Promise<Cart | null>;

  create(cart: Cart): Promise<{ id: string }>;

  save(cart: Cart): Promise<void>;
}

export const CARTS_REPOSITORY = 'ICartsRepository';

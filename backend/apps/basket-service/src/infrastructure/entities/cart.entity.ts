import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { CartItem } from './cart-item.entity';

const CartSchema = defineEntity({
  name: 'Cart',
  tableName: 'carts',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    customerId: p.string().unique(),
    status: p.string().default('OPEN'),
    items: () => p.oneToMany(CartItem).mappedBy('cart'),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class Cart extends CartSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

CartSchema.setClass(Cart);

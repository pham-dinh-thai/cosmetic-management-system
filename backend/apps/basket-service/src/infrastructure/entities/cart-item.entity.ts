import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Cart } from './cart.entity';

const CartItemSchema = defineEntity({
  name: 'CartItem',
  tableName: 'cart_items',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    cart: () => p.manyToOne(Cart).fieldName('cart_id').deleteRule('cascade'),
    variantId: p.string(),
    quantity: p.integer(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class CartItem extends CartItemSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

CartItemSchema.setClass(CartItem);

import { Cart as CartEntity } from '../entities/cart.entity';
import { CartItem as CartItemEntity } from '../entities/cart-item.entity';
import { Cart } from '../../domain/cart.aggregate';
import { CartStatus } from '../../domain/types';

export class CartMapper {
  public static toDomain(entity: CartEntity): Cart {
    return Cart.fromPersistent({
      id: entity.id,
      customerId: entity.customerId,
      status: entity.status as CartStatus,
      items: entity.items
        .getItems()
        .filter((item) => item.variantId)
        .map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

export class CartItemMapper {
  public static toEntity(
    cart: CartEntity,
    item: { variantId: string; quantity: number },
  ): CartItemEntity {
    const entity = new CartItemEntity();
    entity.cart = cart;
    entity.variantId = item.variantId;
    entity.quantity = item.quantity;
    return entity;
  }
}

export const cartItemFromEntity = (
  entity: CartItemEntity,
): { variantId: string; quantity: number } => ({
  variantId: entity.variantId,
  quantity: entity.quantity,
});

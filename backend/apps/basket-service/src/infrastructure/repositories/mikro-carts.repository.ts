import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ICartsRepository } from '../../domain/repositories/carts.repository';
import { Cart } from '../../domain/cart.aggregate';
import { Cart as CartEntity } from '../entities/cart.entity';
import { CartItem as CartItemEntity } from '../entities/cart-item.entity';
import { CartMapper } from '../mappers/carts.mapper';

@Injectable()
export class MikroCartsRepository implements ICartsRepository {
  public constructor(private readonly em: EntityManager) {}

  public async findByCustomerId(customerId: string): Promise<Cart | null> {
    const entity = await this.em.findOne(
      CartEntity,
      { customerId },
      { populate: ['items'] },
    );

    if (!entity) {
      return null;
    }

    return CartMapper.toDomain(entity);
  }

  public async create(cart: Cart): Promise<{ id: string }> {
    const entity = new CartEntity();
    entity.customerId = cart.getCustomerId();
    entity.status = cart.getStatus();

    this.em.persist(entity);

    for (const item of cart.getItems()) {
      const row = new CartItemEntity();
      row.cart = entity;
      row.variantId = item.getVariantId();
      row.quantity = item.getQuantity();
      this.em.persist(row);
    }

    await this.em.flush();

    return { id: entity.id };
  }

  public async save(cart: Cart): Promise<void> {
    await this.em.transactional(async (em) => {
      const entity = await em.findOne(
        CartEntity,
        { customerId: cart.getCustomerId() },
        { populate: ['items'] },
      );

      if (!entity) {
        throw new Error(
          `Cart for customer ${cart.getCustomerId()} was not found`,
        );
      }

      entity.status = cart.getStatus();

      const existingByVariant = new Map<string, CartItemEntity>();

      for (const item of entity.items.getItems()) {
        existingByVariant.set(item.variantId, item);
      }

      for (const item of cart.getItems()) {
        const row = existingByVariant.get(item.getVariantId());

        if (row) {
          row.quantity = item.getQuantity();
          continue;
        }

        const created = new CartItemEntity();
        created.cart = entity;
        created.variantId = item.getVariantId();
        created.quantity = item.getQuantity();
        em.persist(created);
      }

      for (const [variantId, row] of existingByVariant) {
        if (!cart.hasItem(variantId)) {
          em.remove(row);
        }
      }
    });
  }
}

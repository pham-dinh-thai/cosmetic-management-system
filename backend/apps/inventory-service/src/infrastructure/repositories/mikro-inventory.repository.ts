import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inventory as InventoryMikro } from '../entities/inventory.entity';
import { InventoryMapper } from '../mappers/inventory.mapper';
import { Inventory } from '../../domain/inventory.aggregate';
import { IInventoryRepository } from '../../domain/repositories/inventory.repository';
import { InventoryNotFoundException } from '../../domain/exceptions/inventory-not-found.exception';

@Injectable()
export class MikroInventoryRepository implements IInventoryRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<Inventory[]> {
    const inventoriesMikro = await this.entityManager.find(
      InventoryMikro,
      {},
      {
        orderBy: { createdAt: 'DESC' },
      },
    );

    return inventoriesMikro.map((inventoryMikro) =>
      InventoryMapper.toDomain(inventoryMikro),
    );
  }

  public async findById(id: string): Promise<Inventory | null> {
    const inventoryMikro = await this.entityManager.findOne(InventoryMikro, {
      id,
    });

    return inventoryMikro ? InventoryMapper.toDomain(inventoryMikro) : null;
  }

  public async findByVariantId(variantId: string): Promise<Inventory | null> {
    const inventoryMikro = await this.entityManager.findOne(InventoryMikro, {
      variantId,
    });

    return inventoryMikro ? InventoryMapper.toDomain(inventoryMikro) : null;
  }

  public async create(
    variantId: string,
    quantity: number,
  ): Promise<{ id: string }> {
    const inventoryMikro = this.entityManager.create(InventoryMikro, {
      variantId,
      quantity,
      lastUpdatedAt: new Date(),
    });

    await this.entityManager.flush();

    return { id: inventoryMikro.id };
  }

  public async addStock(
    variantId: string,
    quantity: number,
  ): Promise<Inventory> {
    const inventory = await this.findByVariantId(variantId);

    if (!inventory) {
      await this.create(variantId, quantity);
      const created = await this.findByVariantId(variantId);

      if (!created) {
        throw new InventoryNotFoundException(variantId);
      }

      return created;
    }

    inventory.addStock(quantity);

    const inventoryMikro = await this.entityManager.findOne(InventoryMikro, {
      id: inventory.getId(),
    });

    if (!inventoryMikro) {
      throw new InventoryNotFoundException(variantId);
    }

    inventoryMikro.quantity = inventory.getQuantity();
    inventoryMikro.lastUpdatedAt = inventory.getLastUpdatedAt();

    await this.entityManager.flush();

    return inventory;
  }

  public async removeStock(
    variantId: string,
    quantity: number,
  ): Promise<Inventory> {
    const inventory = await this.findByVariantId(variantId);

    if (!inventory) {
      throw new InventoryNotFoundException(variantId);
    }

    inventory.removeStock(quantity);

    const inventoryMikro = await this.entityManager.findOne(InventoryMikro, {
      id: inventory.getId(),
    });

    if (!inventoryMikro) {
      throw new InventoryNotFoundException(variantId);
    }

    inventoryMikro.quantity = inventory.getQuantity();
    inventoryMikro.lastUpdatedAt = inventory.getLastUpdatedAt();

    await this.entityManager.flush();

    return inventory;
  }

  public async adjust(
    id: string,
    adjustment: number,
  ): Promise<Inventory | null> {
    const inventory = await this.findById(id);

    if (!inventory) {
      return null;
    }

    inventory.adjust(adjustment);

    const inventoryMikro = await this.entityManager.findOne(InventoryMikro, {
      id,
    });

    if (!inventoryMikro) {
      return null;
    }

    inventoryMikro.quantity = inventory.getQuantity();
    inventoryMikro.lastUpdatedAt = inventory.getLastUpdatedAt();

    await this.entityManager.flush();

    return inventory;
  }
}

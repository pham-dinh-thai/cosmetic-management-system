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

  public async findExpiring(days: number): Promise<Inventory[]> {
    const end = new Date(Date.now() + days * 86_400_000);
    const endExpiry =
      `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-` +
      String(end.getDate()).padStart(2, '0');

    const inventoriesMikro = await this.entityManager.find(
      InventoryMikro,
      { quantity: { $gt: 0 }, expiryDate: { $lte: endExpiry } },
      { orderBy: { expiryDate: 'ASC' } },
    );

    return inventoriesMikro.map((inventoryMikro) =>
      InventoryMapper.toDomain(inventoryMikro),
    );
  }

  public async findOverstock(days: number): Promise<Inventory[]> {
    const cutoff = new Date(Date.now() - days * 86_400_000);

    const inventoriesMikro = await this.entityManager.find(
      InventoryMikro,
      { quantity: { $gt: 0 }, lastUpdatedAt: { $lt: cutoff } },
      { orderBy: { lastUpdatedAt: 'ASC' } },
    );

    return inventoriesMikro.map((inventoryMikro) =>
      InventoryMapper.toDomain(inventoryMikro),
    );
  }

  public async create(
    variantId: string,
    quantity: number,
    expiryDate?: Date,
  ): Promise<{ id: string }> {
    const inventoryMikro = this.entityManager.create(InventoryMikro, {
      variantId,
      quantity,
      lastUpdatedAt: new Date(),
      ...(expiryDate ? { expiryDate: this.toDateString(expiryDate) } : {}),
    });

    await this.entityManager.flush();

    return { id: inventoryMikro.id };
  }

  public async addStock(
    variantId: string,
    quantity: number,
    expiryDate?: Date,
  ): Promise<Inventory> {
    const inventory = await this.findByVariantId(variantId);

    if (!inventory) {
      await this.create(variantId, quantity, expiryDate);
      const created = await this.findByVariantId(variantId);

      if (!created) {
        throw new InventoryNotFoundException(variantId);
      }

      return created;
    }

    inventory.addStock(quantity);

    if (expiryDate) {
      inventory.setExpiryDate(expiryDate);
    }

    const inventoryMikro = await this.entityManager.findOne(InventoryMikro, {
      id: inventory.getId(),
    });

    if (!inventoryMikro) {
      throw new InventoryNotFoundException(variantId);
    }

    inventoryMikro.quantity = inventory.getQuantity();
    inventoryMikro.lastUpdatedAt = inventory.getLastUpdatedAt();

    if (expiryDate) {
      inventoryMikro.expiryDate = this.toDateString(expiryDate);
    }

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

  private toDateString(date: Date): string {
    return (
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-` +
      String(date.getDate()).padStart(2, '0')
    );
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

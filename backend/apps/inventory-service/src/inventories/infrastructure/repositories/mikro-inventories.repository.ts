import { Injectable } from '@nestjs/common';
import { IInventoriesRepository } from '../../domain/repositories/inventories.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inventory as InventoryMikro } from '../entities/inventory.entity';
import { Inventory } from '../../domain/inventory.aggregate';

@Injectable()
export class MikroInventoriesRepository implements IInventoriesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<Inventory[]> {
    const inventoriesMikro = await this.entityManager.find(
      InventoryMikro,
      {},
      {
        populate: ['batches'],
        orderBy: { createdAt: 'ASC' },
      },
    );

    return inventoriesMikro.map((inventoryMikro) =>
      this.toDomain(inventoryMikro),
    );
  }

  public async findById(id: string): Promise<Inventory | null> {
    const inventoryMikro = await this.entityManager.findOne(
      InventoryMikro,
      {
        id,
      },
      {
        populate: ['batches'],
      },
    );

    if (!inventoryMikro) {
      return null;
    }

    return this.toDomain(inventoryMikro);
  }

  public async findByVariantId(variantId: string): Promise<Inventory | null> {
    const inventoryMikro = await this.entityManager.findOne(
      InventoryMikro,
      {
        variantId,
      },
      {
        populate: ['batches'],
      },
    );

    if (!inventoryMikro) {
      return null;
    }

    return this.toDomain(inventoryMikro);
  }

  public async create(inventory: Inventory): Promise<void> {
    const inventoryMikro = this.entityManager.create(InventoryMikro, {
      variantId: inventory.getVariantId(),
      minStock: inventory.getMinStock(),
      isActive: inventory.getIsActive(),
      createdAt: inventory.getCreatedAt(),
      updatedAt: inventory.getUpdatedAt(),
    });

    this.entityManager.persist(inventoryMikro);

    await this.entityManager.flush();
  }

  public async updateMinStock(inventory: Inventory): Promise<void> {
    await this.entityManager.nativeUpdate(
      InventoryMikro,
      {
        id: inventory.getId(),
      },
      {
        minStock: inventory.getMinStock(),
        updatedAt: inventory.getUpdatedAt(),
      },
    );
  }

  public async setIsActive(inventory: Inventory): Promise<void> {
    await this.entityManager.nativeUpdate(
      InventoryMikro,
      {
        id: inventory.getId(),
      },
      {
        isActive: inventory.getIsActive(),
        updatedAt: inventory.getUpdatedAt(),
      },
    );
  }

  private toDomain(inventoryMikro: InventoryMikro): Inventory {
    return Inventory.fromPersistent({
      id: inventoryMikro.id,
      variantId: inventoryMikro.variantId,
      batches: inventoryMikro.batches.getItems().map((batch) => ({
        id: batch.id,
        lotNumber: batch.lotNumber,
        supplierId: batch.supplierId,
        quantity: batch.quantity,
        expiredDate: new Date(batch.expiryDate),
        isActive: batch.isActive,
        createdBy: batch.createdBy,
        createdAt: new Date(batch.createdAt),
        updatedAt: new Date(batch.updatedAt),
      })),
      minStock: inventoryMikro.minStock,
      isActive: inventoryMikro.isActive,
      createdAt: new Date(inventoryMikro.createdAt),
      updatedAt: new Date(inventoryMikro.updatedAt),
    });
  }
}
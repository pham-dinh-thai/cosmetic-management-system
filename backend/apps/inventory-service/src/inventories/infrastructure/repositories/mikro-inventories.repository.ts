import { Injectable } from '@nestjs/common';
import { IInventoriesRepository } from '../../domain/repositories/inventories.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inventory as InventoryMikro } from '../entities/inventory.entity';
import { Inventory } from '../../domain/inventory.aggregate';
import { InventoriesMapper } from '../mappers/inventories.mapper';

@Injectable()
export class MikroInventoriesRepository implements IInventoriesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

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

    return InventoriesMapper.toDomain(inventoryMikro);
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
}

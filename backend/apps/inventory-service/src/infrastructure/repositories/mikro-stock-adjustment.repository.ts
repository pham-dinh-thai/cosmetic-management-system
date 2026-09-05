import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inventory as InventoryMikro } from '../entities/inventory.entity';
import { StockAdjustment as StockAdjustmentMikro } from '../entities/stock-adjustment.entity';
import { InventoryMapper } from '../mappers/inventory.mapper';
import { StockAdjustmentMapper } from '../mappers/stock-adjustment.mapper';
import { StockAdjustment } from '../../domain/stock-adjustment.aggregate';
import { InventoryNotFoundException } from '../../domain/exceptions/inventory-not-found.exception';
import {
  AdjustStockFilters,
  IStockAdjustmentRepository,
} from '../../domain/repositories/stock-adjustment.repository';
import { StockAdjustmentReason } from '../../domain/types';

@Injectable()
export class MikroStockAdjustmentRepository implements IStockAdjustmentRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async recordAdjustment(input: {
    variantId: string;
    adjustment: number;
    reason: StockAdjustmentReason;
    note: string | null;
    createdBy: string;
  }): Promise<{ id: string; variantId: string; quantity: number }> {
    return await this.entityManager.transactional(async (em) => {
      const inventoryMikro = await em.findOne(InventoryMikro, {
        variantId: input.variantId,
      });

      if (!inventoryMikro) {
        throw new InventoryNotFoundException(input.variantId);
      }

      const inventory = InventoryMapper.toDomain(inventoryMikro);
      inventory.adjust(input.adjustment);

      inventoryMikro.quantity = inventory.getQuantity();
      inventoryMikro.lastUpdatedAt = inventory.getLastUpdatedAt();

      const adjustmentMikro = em.create(StockAdjustmentMikro, {
        inventoryId: inventoryMikro.id,
        variantId: input.variantId,
        adjustment: input.adjustment,
        reason: input.reason,
        note: input.note,
        createdBy: input.createdBy,
      });

      await em.flush();

      return {
        id: adjustmentMikro.id,
        variantId: input.variantId,
        quantity: inventory.getQuantity(),
      };
    });
  }

  public async findAll(
    filters: AdjustStockFilters,
  ): Promise<StockAdjustment[]> {
    const where: Partial<{
      variantId: string;
      reason: StockAdjustmentReason;
    }> = {};

    if (filters.variantId) {
      where.variantId = filters.variantId;
    }

    if (filters.reason) {
      where.reason = filters.reason;
    }

    const adjustmentsMikro = await this.entityManager.find(
      StockAdjustmentMikro,
      where,
      { orderBy: { createdAt: 'DESC' } },
    );

    return adjustmentsMikro.map((adjustmentMikro) =>
      StockAdjustmentMapper.toDomain(adjustmentMikro),
    );
  }
}

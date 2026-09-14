import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { StockAdjustment as StockAdjustmentDomain } from '../../domain/stock-adjustment.aggregate';
import {
  FindStockAdjustmentsFilters,
  IStockAdjustmentRepository,
  RecordStockAdjustmentResult,
} from '../../domain/repositories/stock-adjustments.repository';
import { StockAdjustmentReason } from '../../domain/types';
import { Batch as BatchMikro } from '../../../inventories/infrastructure/entities/batch.entity';
import { StockAdjustment as StockAdjustmentEntity } from '../entities/stock-adjustment.entity';

@Injectable()
export class MikroStockAdjustmentsRepository
  implements IStockAdjustmentRepository
{
  public constructor(private readonly entityManager: EntityManager) {}

  public async recordAdjustment(
    adjustment: StockAdjustmentDomain,
  ): Promise<RecordStockAdjustmentResult> {
    const entity = this.entityManager.create(StockAdjustmentEntity, {
      batch: this.entityManager.getReference(
        BatchMikro,
        adjustment.getBatchId(),
      ),
      variantId: adjustment.getVariantId(),
      adjustment: adjustment.getAdjustment(),
      reason: adjustment.getReason(),
      note: adjustment.getNote(),
      createdBy: adjustment.getCreatedBy(),
    });

    await this.entityManager.persist(entity).flush();

    return { id: entity.id };
  }

  public async findAll(
    filters: FindStockAdjustmentsFilters,
  ): Promise<StockAdjustmentDomain[]> {
    const where: Record<string, unknown> = {
      ...(filters.variantId ? { variantId: filters.variantId } : {}),
      ...(filters.reason ? { reason: filters.reason } : {}),
      ...(filters.batchId ? { batch: filters.batchId } : {}),
    };

    const entities = await this.entityManager.find(
      StockAdjustmentEntity,
      where,
      {
        populate: ['batch'],
        orderBy: { createdAt: 'DESC' },
      },
    );

    return entities.map((entity) =>
      StockAdjustmentDomain.fromPersistent({
        id: entity.id,
        batchId: entity.batch.id,
        variantId: entity.variantId,
        adjustment: entity.adjustment,
        reason: entity.reason as StockAdjustmentReason,
        note: entity.note ?? null,
        createdBy: entity.createdBy,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      }),
    );
  }
}
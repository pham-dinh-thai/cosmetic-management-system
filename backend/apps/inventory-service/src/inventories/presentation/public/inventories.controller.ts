import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard, PermissionsGuard, Permissions } from '@app/security';
import { Audit, AuditAction, paramId, responseId } from '@app/audit-client';
import { FindAllInventoriesUseCase } from '../../application/use-cases/find-all-inventory/find-all-inventories.use-case';
import { InventoryReadModel } from '../../application/use-cases/find-all-inventory/read-models/inventory.read-model';
import { FindInventoryByVariantUseCase } from '../../application/use-cases/find-inventory-by-variant/find-inventory-by-variant.use-case';
import { FindInventoryByIdUseCase } from '../../application/use-cases/find-inventory-by-id/find-inventory-by-id.use-case';
import { CreateInventoryUseCase } from '../../application/use-cases/create-inventory/create-inventory.use-case';
import { UpdateInventoryMinStockUseCase } from '../../application/use-cases/update-inventory-min-stock/update-inventory-min-stock.use-case';
import { ActivateInventoryUseCase } from '../../application/use-cases/activate-inventory/activate-inventory.use-case';
import { DeactivateInventoryUseCase } from '../../application/use-cases/deactivate-inventory/deactivate-inventory.use-case';
import { AddBatchToInventoryUseCase } from '../../application/use-cases/add-batch-to-inventory/add-batch-to-inventory.use-case';
import { ActivateBatchOnInventoryUseCase } from '../../application/use-cases/activate-batch-on-inventory/activate-batch-on-inventory.use-case';
import { DeactivateBatchOnInventoryUseCase } from '../../application/use-cases/deactivate-batch-on-inventory/deactivate-batch-on-inventory.use-case';
import { DecreaseBatchStockUseCase } from '../../application/use-cases/decrease-batch-stock/decrease-batch-stock.use-case';
import { AdjustBatchStockUseCase } from '../../application/use-cases/adjust-batch-stock/adjust-batch-stock.use-case';
import { FindExpiringBatchesUseCase } from '../../application/use-cases/find-expiring-batches/find-expiring-batches.use-case';
import { FindOverstockBatchesUseCase } from '../../application/use-cases/find-overstock-batches/find-overstock-batches.use-case';
import { BatchReadModel } from '../../application/use-cases/find-batches/read-models/batch.read-model';

import { CreateInventoryRequest } from './requests/create-inventory.request';
import { AddBatchRequest } from './requests/add-batch.request';
import { UpdateInventoryMinStockRequest } from './requests/update-inventory-min-stock.request';
import { DecreaseStockRequest } from './requests/decrease-stock.request';
import { AdjustBatchStockRequest } from './requests/adjust-batch-stock.request';

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('inventory:read')
@Controller('inventories')
export class InventoriesController {
  public constructor(
    private readonly findAllInventoriesUseCase: FindAllInventoriesUseCase,
    private readonly findInventoryByVariantUseCase: FindInventoryByVariantUseCase,
    private readonly findInventoryByIdUseCase: FindInventoryByIdUseCase,
    private readonly createInventoryUseCase: CreateInventoryUseCase,
    private readonly updateInventoryMinStockUseCase: UpdateInventoryMinStockUseCase,
    private readonly activateInventoryUseCase: ActivateInventoryUseCase,
    private readonly deactivateInventoryUseCase: DeactivateInventoryUseCase,
    private readonly addBatchToInventoryUseCase: AddBatchToInventoryUseCase,
    private readonly activateBatchOnInventoryUseCase: ActivateBatchOnInventoryUseCase,
    private readonly deactivateBatchOnInventoryUseCase: DeactivateBatchOnInventoryUseCase,
    private readonly decreaseBatchStockUseCase: DecreaseBatchStockUseCase,
    private readonly adjustBatchStockUseCase: AdjustBatchStockUseCase,
    private readonly findExpiringBatchesUseCase: FindExpiringBatchesUseCase,
    private readonly findOverstockBatchesUseCase: FindOverstockBatchesUseCase,
  ) {}

  
  @Get()
  public async findAll(): Promise<InventoryReadModel[]> {
    return await this.findAllInventoriesUseCase.execute();
  }

  
  @Get('by-variant/:variantId')
  public async findByVariant(
    @Param('variantId') variantId: string,
  ): Promise<InventoryReadModel> {
    return await this.findInventoryByVariantUseCase.execute(variantId);
  }

  
  @Get('expiring')
  public async findExpiring(
    @Query('days') days?: number,
  ): Promise<BatchReadModel[]> {
    return await this.findExpiringBatchesUseCase.execute(days);
  }

  
  @Get('overstock')
  public async findOverstock(
    @Query('days') days?: number,
  ): Promise<BatchReadModel[]> {
    return await this.findOverstockBatchesUseCase.execute(days);
  }

  
  @Get(':id')
  public async findById(@Param('id') id: string): Promise<InventoryReadModel> {
    return await this.findInventoryByIdUseCase.execute(id);
  }

  
  @Permissions('inventory:write')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Audit({
    entityType: 'inventory',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async create(
    @Body() request: CreateInventoryRequest,
  ): Promise<{ id: string; variantId: string }> {
    await this.createInventoryUseCase.execute({
      variantId: request.variantId,
      minStock: request.minStock,
    });

    const inventory = await this.findInventoryByVariantUseCase.execute(
      request.variantId,
    );

    return { id: inventory.id, variantId: inventory.variantId };
  }

  
  @HttpCode(HttpStatus.OK)
  @Permissions('inventory:write')
  @Patch(':id/min-stock')
  @Audit({
    entityType: 'inventory',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async updateMinStock(
    @Param('id') id: string,
    @Body() request: UpdateInventoryMinStockRequest,
  ): Promise<{ id: string; minStock: number }> {
    await this.updateInventoryMinStockUseCase.execute(id, {
      minStock: request.minStock,
    });

    return { id, minStock: request.minStock };
  }

  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('inventory:write')
  @Patch(':id/activate')
  @Audit({
    entityType: 'inventory',
    action: AuditAction.ACTIVATE,
    entityId: paramId(),
  })
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateInventoryUseCase.execute(id);
  }

  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('inventory:write')
  @Patch(':id/deactivate')
  @Audit({
    entityType: 'inventory',
    action: AuditAction.DEACTIVATE,
    entityId: paramId(),
  })
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateInventoryUseCase.execute(id);
  }

  
  @HttpCode(HttpStatus.CREATED)
  @Permissions('inventory:write')
  @Post(':id/batches')
  @Audit({
    entityType: 'inventory-batch',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async addBatch(
    @Param('id') id: string,
    @Body() request: AddBatchRequest,
    @Req() httpRequest: Request,
  ): Promise<{ id: string; lotNumber: string }> {
    const createdBy =
      (httpRequest as unknown as { user?: { sub?: string } }).user?.sub ?? '';

    await this.addBatchToInventoryUseCase.execute(
      id,
      {
        supplierId: request.supplierId,
        quantity: request.quantity,
        expiredDate: new Date(`${request.expiredDate}T00:00:00`),
      },
      createdBy,
    );

    const inventory = await this.findInventoryByIdUseCase.execute(id);

    const batch = inventory.batches[inventory.batches.length - 1];

    return { id: batch.id, lotNumber: batch.lotNumber };
  }

  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('inventory:write')
  @Patch(':id/batches/:batchId/activate')
  @Audit({
    entityType: 'inventory-batch',
    action: AuditAction.ACTIVATE,
    entityId: paramId('batchId'),
  })
  public async activateBatch(
    @Param('id') id: string,
    @Param('batchId') batchId: string,
  ): Promise<void> {
    await this.activateBatchOnInventoryUseCase.execute(id, batchId);
  }

  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('inventory:write')
  @Patch(':id/batches/:batchId/deactivate')
  @Audit({
    entityType: 'inventory-batch',
    action: AuditAction.DEACTIVATE,
    entityId: paramId('batchId'),
  })
  public async deactivateBatch(
    @Param('id') id: string,
    @Param('batchId') batchId: string,
  ): Promise<void> {
    await this.deactivateBatchOnInventoryUseCase.execute(id, batchId);
  }

  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('inventory:write')
  @Patch(':id/batches/:batchId/adjust')
  @Audit({
    entityType: 'inventory-batch',
    action: AuditAction.UPDATE,
    entityId: paramId('batchId'),
  })
  public async adjustBatchStock(
    @Param('id') id: string,
    @Param('batchId') batchId: string,
    @Body() request: AdjustBatchStockRequest,
  ): Promise<void> {
    await this.adjustBatchStockUseCase.execute(id, batchId, {
      adjustedQuantity: request.adjustedQuantity,
    });
  }

  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('inventory:write')
  @Post(':id/decrease-stock')
  @Audit({
    entityType: 'inventory',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async decreaseStock(
    @Param('id') id: string,
    @Body() request: DecreaseStockRequest,
  ): Promise<void> {
    await this.decreaseBatchStockUseCase.execute(id, {
      requestedQuantity: request.requestedQuantity,
    });
  }
}

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
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { FindAllInventoriesUseCase } from 'apps/inventory-service/src/application/use-cases/find-all-inventory/find-all-inventories.use-case';
import { InventoryReadModel } from 'apps/inventory-service/src/application/use-cases/find-all-inventory/read-models/inventory.read-model';
import { FindInventoryByVariantUseCase } from 'apps/inventory-service/src/application/use-cases/find-inventory-by-variant/find-inventory-by-variant.use-case';
import { AdjustInventoryUseCase } from 'apps/inventory-service/src/application/use-cases/adjust-inventory/adjust-inventory.use-case';
import { AdjustInventoryWithReasonUseCase } from 'apps/inventory-service/src/application/use-cases/adjust-inventory-with-reason/adjust-inventory-with-reason.use-case';
import { FindStockAdjustmentsUseCase } from 'apps/inventory-service/src/application/use-cases/find-stock-adjustments/find-stock-adjustments.use-case';
import { StockAdjustmentReadModel } from 'apps/inventory-service/src/application/use-cases/find-stock-adjustments/read-models/stock-adjustment.read-model';
import { FindExpiringInventoriesUseCase } from 'apps/inventory-service/src/application/use-cases/find-expiring-inventories/find-expiring-inventories.use-case';
import { ExpiringInventoryReadModel } from 'apps/inventory-service/src/application/use-cases/find-expiring-inventories/read-models/expiring-inventory.read-model';
import { FindOverstockInventoriesUseCase } from 'apps/inventory-service/src/application/use-cases/find-overstock-inventories/find-overstock-inventories.use-case';
import { OverstockInventoryReadModel } from 'apps/inventory-service/src/application/use-cases/find-overstock-inventories/read-models/overstock-inventory.read-model';
import type { StockAdjustmentReason } from 'apps/inventory-service/src/domain/types';
import { AdjustInventoryRequest } from './requests/adjust-inventory.request';
import { AddStockAdjustmentRequest } from './requests/add-stock-adjustment.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('inventory')
export class InventoryController {
  public constructor(
    private readonly findAllInventoriesUseCase: FindAllInventoriesUseCase,
    private readonly findInventoryByVariantUseCase: FindInventoryByVariantUseCase,
    private readonly adjustInventoryUseCase: AdjustInventoryUseCase,
    private readonly adjustInventoryWithReasonUseCase: AdjustInventoryWithReasonUseCase,
    private readonly findStockAdjustmentsUseCase: FindStockAdjustmentsUseCase,
    private readonly findExpiringInventoriesUseCase: FindExpiringInventoriesUseCase,
    private readonly findOverstockInventoriesUseCase: FindOverstockInventoriesUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<InventoryReadModel[]> {
    return await this.findAllInventoriesUseCase.execute();
  }

  @Get('by-variant/:variantId')
  public async findByVariant(
    @Param('variantId') variantId: string,
  ): Promise<InventoryReadModel | null> {
    return await this.findInventoryByVariantUseCase.execute(variantId);
  }

  @Get('adjustments')
  public async findAdjustments(
    @Query('variantId') variantId?: string,
    @Query('reason') reason?: StockAdjustmentReason,
  ): Promise<StockAdjustmentReadModel[]> {
    return await this.findStockAdjustmentsUseCase.execute({
      variantId,
      reason,
    });
  }

  @Get('expiring')
  public async findExpiring(
    @Query('days') days?: number,
  ): Promise<ExpiringInventoryReadModel[]> {
    return await this.findExpiringInventoriesUseCase.execute(days);
  }

  @Get('overstock')
  public async findOverstock(
    @Query('days') days?: number,
  ): Promise<OverstockInventoryReadModel[]> {
    return await this.findOverstockInventoriesUseCase.execute(days);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('adjustments')
  public async addAdjustment(
    @Body() request: AddStockAdjustmentRequest,
    @Req() httpRequest: Request,
  ): Promise<{ id: string; variantId: string; quantity: number }> {
    const createdBy =
      (httpRequest as unknown as { user?: { sub?: string } }).user?.sub ?? '';

    return await this.adjustInventoryWithReasonUseCase.execute({
      variantId: request.variantId,
      adjustment: request.adjustment,
      reason: request.reason as StockAdjustmentReason,
      note: request.note,
      createdBy,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/adjust')
  public async adjust(
    @Param('id') id: string,
    @Body() request: AdjustInventoryRequest,
  ): Promise<{ id: string; quantity: number }> {
    return await this.adjustInventoryUseCase.execute(id, request.adjustment);
  }
}

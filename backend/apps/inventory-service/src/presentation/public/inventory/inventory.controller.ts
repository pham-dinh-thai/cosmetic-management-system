import {
  Body,
  Controller,
  Delete,
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
import { AuthGuard, Departments, OrgGuard, Role, Roles } from '@app/security';
import { FindAllInventoriesUseCase } from 'apps/inventory-service/src/application/use-cases/find-all-inventory/find-all-inventories.use-case';
import { InventoryReadModel } from 'apps/inventory-service/src/application/use-cases/find-all-inventory/read-models/inventory.read-model';
import { FindInventoryByVariantUseCase } from 'apps/inventory-service/src/application/use-cases/find-inventory-by-variant/find-inventory-by-variant.use-case';
import { FindInventoryByIdUseCase } from 'apps/inventory-service/src/application/use-cases/find-inventory-by-id/find-inventory-by-id.use-case';
import { DeleteInventoryUseCase } from 'apps/inventory-service/src/application/use-cases/delete-inventory/delete-inventory.use-case';
import { AdjustInventoryUseCase } from 'apps/inventory-service/src/application/use-cases/adjust-inventory/adjust-inventory.use-case';
import { AdjustInventoryWithReasonUseCase } from 'apps/inventory-service/src/application/use-cases/adjust-inventory-with-reason/adjust-inventory-with-reason.use-case';
import { FindStockAdjustmentsUseCase } from 'apps/inventory-service/src/application/use-cases/find-stock-adjustments/find-stock-adjustments.use-case';
import { StockAdjustmentReadModel } from 'apps/inventory-service/src/application/use-cases/find-stock-adjustments/read-models/stock-adjustment.read-model';
import { FindExpiringInventoriesUseCase } from 'apps/inventory-service/src/application/use-cases/find-expiring-inventories/find-expiring-inventories.use-case';
import { ExpiringInventoryReadModel } from 'apps/inventory-service/src/application/use-cases/find-expiring-inventories/read-models/expiring-inventory.read-model';
import { FindOverstockInventoriesUseCase } from 'apps/inventory-service/src/application/use-cases/find-overstock-inventories/find-overstock-inventories.use-case';
import { OverstockInventoryReadModel } from 'apps/inventory-service/src/application/use-cases/find-overstock-inventories/read-models/overstock-inventory.read-model';
import type { StockAdjustmentReason } from 'apps/inventory-service/src/domain/types';
import { InventoryNotFoundException } from 'apps/inventory-service/src/domain/exceptions/inventory-not-found.exception';
import { AdjustInventoryRequest } from './requests/adjust-inventory.request';
import { AddStockAdjustmentRequest } from './requests/add-stock-adjustment.request';
import { UpdateInventoryMinStockRequest } from './requests/update-inventory-min-stock.request';
import { UpdateInventoryMinStockUseCase } from 'apps/inventory-service/src/application/use-cases/update-inventory-min-stock/update-inventory-min-stock.use-case';

@Controller('inventory')
export class InventoryController {
  public constructor(
    private readonly findAllInventoriesUseCase: FindAllInventoriesUseCase,
    private readonly findInventoryByVariantUseCase: FindInventoryByVariantUseCase,
    private readonly findInventoryByIdUseCase: FindInventoryByIdUseCase,
    private readonly deleteInventoryUseCase: DeleteInventoryUseCase,
    private readonly adjustInventoryUseCase: AdjustInventoryUseCase,
    private readonly adjustInventoryWithReasonUseCase: AdjustInventoryWithReasonUseCase,
    private readonly findStockAdjustmentsUseCase: FindStockAdjustmentsUseCase,
    private readonly findExpiringInventoriesUseCase: FindExpiringInventoriesUseCase,
    private readonly findOverstockInventoriesUseCase: FindOverstockInventoriesUseCase,
    private readonly updateInventoryMinStockUseCase: UpdateInventoryMinStockUseCase,
  ) {}

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
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

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
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

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get('expiring')
  public async findExpiring(
    @Query('days') days?: number,
  ): Promise<ExpiringInventoryReadModel[]> {
    return await this.findExpiringInventoriesUseCase.execute(days);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get('overstock')
  public async findOverstock(
    @Query('days') days?: number,
  ): Promise<OverstockInventoryReadModel[]> {
    return await this.findOverstockInventoriesUseCase.execute(days);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<InventoryReadModel> {
    const inventory = await this.findInventoryByIdUseCase.execute(id);

    if (!inventory) {
      throw new InventoryNotFoundException(id);
    }

    return inventory;
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
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
      minStock: request.minStock,
    });
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.OK)
  @Patch(':id/adjust')
  public async adjust(
    @Param('id') id: string,
    @Body() request: AdjustInventoryRequest,
  ): Promise<{ id: string; quantity: number }> {
    return await this.adjustInventoryUseCase.execute(id, request.adjustment);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.OK)
  @Patch(':id/min-stock')
  public async updateMinStock(
    @Param('id') id: string,
    @Body() request: UpdateInventoryMinStockRequest,
  ): Promise<{ id: string; minStock: number }> {
    return await this.updateInventoryMinStockUseCase.execute(
      id,
      request.minStock,
    );
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    await this.deleteInventoryUseCase.execute(id);
    return { deleted: true };
  }
}

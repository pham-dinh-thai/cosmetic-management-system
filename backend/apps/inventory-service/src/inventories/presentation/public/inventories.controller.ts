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
import { AuthGuard, Departments, OrgGuard, Role, Roles } from '@app/security';
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

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get()
  public async findAll(): Promise<InventoryReadModel[]> {
    return await this.findAllInventoriesUseCase.execute();
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get('by-variant/:variantId')
  public async findByVariant(
    @Param('variantId') variantId: string,
  ): Promise<InventoryReadModel> {
    return await this.findInventoryByVariantUseCase.execute(variantId);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get('expiring')
  public async findExpiring(
    @Query('days') days?: number,
  ): Promise<BatchReadModel[]> {
    return await this.findExpiringBatchesUseCase.execute(days);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get('overstock')
  public async findOverstock(
    @Query('days') days?: number,
  ): Promise<BatchReadModel[]> {
    return await this.findOverstockBatchesUseCase.execute(days);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get(':id')
  public async findById(@Param('id') id: string): Promise<InventoryReadModel> {
    return await this.findInventoryByIdUseCase.execute(id);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.CREATED)
  @Post()
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

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.OK)
  @Patch(':id/min-stock')
  public async updateMinStock(
    @Param('id') id: string,
    @Body() request: UpdateInventoryMinStockRequest,
  ): Promise<{ id: string; minStock: number }> {
    await this.updateInventoryMinStockUseCase.execute(id, {
      minStock: request.minStock,
    });

    return { id, minStock: request.minStock };
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/activate')
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateInventoryUseCase.execute(id);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/deactivate')
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateInventoryUseCase.execute(id);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/batches')
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

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/batches/:batchId/activate')
  public async activateBatch(
    @Param('id') id: string,
    @Param('batchId') batchId: string,
  ): Promise<void> {
    await this.activateBatchOnInventoryUseCase.execute(id, batchId);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/batches/:batchId/deactivate')
  public async deactivateBatch(
    @Param('id') id: string,
    @Param('batchId') batchId: string,
  ): Promise<void> {
    await this.deactivateBatchOnInventoryUseCase.execute(id, batchId);
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/batches/:batchId/adjust')
  public async adjustBatchStock(
    @Param('id') id: string,
    @Param('batchId') batchId: string,
    @Body() request: AdjustBatchStockRequest,
  ): Promise<void> {
    await this.adjustBatchStockUseCase.execute(id, batchId, {
      adjustedQuantity: request.adjustedQuantity,
    });
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/decrease-stock')
  public async decreaseStock(
    @Param('id') id: string,
    @Body() request: DecreaseStockRequest,
  ): Promise<void> {
    await this.decreaseBatchStockUseCase.execute(id, {
      requestedQuantity: request.requestedQuantity,
    });
  }
}

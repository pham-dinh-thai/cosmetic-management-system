import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard, Departments, OrgGuard, Role, Roles } from '@app/security';
import { Audit, AuditAction, responseId } from '@app/audit-client';
import { AdjustBatchStockWithReasonUseCase } from '../application/use-cases/adjust-batch-stock-with-reason/adjust-batch-stock-with-reason.use-case';
import { IAdjustBatchStockWithReasonRequest } from '../application/use-cases/adjust-batch-stock-with-reason/adjust-batch-stock-with-reason.request';
import { FindStockAdjustmentsUseCase } from '../application/use-cases/find-stock-adjustments/find-stock-adjustments.use-case';
import { StockAdjustmentReadModel } from '../application/use-cases/find-stock-adjustments/read-models/stock-adjustment.read-model';
import { CreateStockAdjustmentRequest } from './requests/create-stock-adjustment.request';
import { FindStockAdjustmentsQuery } from './requests/find-stock-adjustments.query';

@Controller('stock-adjustments')
export class StockAdjustmentsController {
  public constructor(
    private readonly adjustBatchStockWithReasonUseCase: AdjustBatchStockWithReasonUseCase,
    private readonly findStockAdjustmentsUseCase: FindStockAdjustmentsUseCase,
  ) {}

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Audit({
    entityType: 'stock-adjustment',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async create(
    @Body() request: CreateStockAdjustmentRequest,
    @Req() httpRequest: Request,
  ): Promise<{
    id: string;
    batchId: string;
    variantId: string;
    quantity: number;
  }> {
    const createdBy =
      (httpRequest as unknown as { user?: { sub?: string } }).user?.sub ?? '';

    const input: IAdjustBatchStockWithReasonRequest = {
      adjustment: request.adjustment,
      reason: request.reason,
      note: request.note,
    };

    return await this.adjustBatchStockWithReasonUseCase.execute(
      request.batchId,
      input,
      createdBy,
    );
  }

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('warehouse')
  @Get()
  public async findAll(
    @Query() query: FindStockAdjustmentsQuery,
  ): Promise<StockAdjustmentReadModel[]> {
    return await this.findStockAdjustmentsUseCase.execute({
      variantId: query.variantId,
      batchId: query.batchId,
      reason: query.reason,
    });
  }
}
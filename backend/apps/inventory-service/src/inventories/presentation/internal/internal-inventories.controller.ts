import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Audit, AuditAction, responseId } from '@app/audit-client';
import { FindInventoryByVariantUseCase } from '../../application/use-cases/find-inventory-by-variant/find-inventory-by-variant.use-case';
import { AddBatchToInventoryUseCase } from '../../application/use-cases/add-batch-to-inventory/add-batch-to-inventory.use-case';
import { CreateInventoryUseCase } from '../../application/use-cases/create-inventory/create-inventory.use-case';
import { InventoryNotFoundException } from '../../domain/exceptions/inventory-not-found.exception';
import { InternalReverseRequest } from './requests/internal-reverse.request';
import { InternalRestoreStockRequest } from './requests/internal-restore-stock.request';
import { DecreaseBatchStockUseCase } from '../../application/use-cases/decrease-batch-stock/decrease-batch-stock.use-case';
import { ReverseBatchStockUseCase } from '../../application/use-cases/reverse-batch-stock/reverse-batch-stock.use-case';
import { RestoreBatchStockUseCase } from '../../application/use-cases/restore-batch-stock/restore-batch-stock.use-case';
import { InternalAddBatchRequest } from './requests/internal-add-batch.request';
import { InternalSaleRequest } from './requests/internal-sale.request';

@Controller('internal/inventories')
export class InternalInventoriesController {
  public constructor(
    private readonly findInventoryByVariantUseCase: FindInventoryByVariantUseCase,
    private readonly addBatchToInventoryUseCase: AddBatchToInventoryUseCase,
    private readonly createInventoryUseCase: CreateInventoryUseCase,
    private readonly decreaseBatchStockUseCase: DecreaseBatchStockUseCase,
    private readonly reverseBatchStockUseCase: ReverseBatchStockUseCase,
    private readonly restoreBatchStockUseCase: RestoreBatchStockUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('purchase')
  @Audit({
    entityType: 'inventory',
    action: AuditAction.UPDATE,
    entityId: responseId('variantId'),
    actorId: (req) => {
      const createdBy = (req.body as { createdBy?: string } | undefined)
        ?.createdBy;
      return createdBy;
    },
  })
  public async purchase(@Body() request: InternalAddBatchRequest): Promise<{
    variantId: string;
    quantity: number;
    lotNumber: string;
    batchId: string;
  }> {
    let inventory: { id: string };

    try {
      inventory = await this.findInventoryByVariantUseCase.execute(
        request.variantId,
      );
    } catch (error) {
      if (!(error instanceof InventoryNotFoundException)) {
        throw error;
      }

      await this.createInventoryUseCase.execute({
        variantId: request.variantId,
        minStock: 0,
      });
      inventory = await this.findInventoryByVariantUseCase.execute(
        request.variantId,
      );
    }

    await this.addBatchToInventoryUseCase.execute(
      inventory.id,
      {
        supplierId: request.supplierId,
        quantity: request.quantity,
        expiredDate: new Date(`${request.expiredDate}T00:00:00`),
      },
      request.createdBy ?? '',
    );

    const updated = await this.findInventoryByVariantUseCase.execute(
      request.variantId,
    );

    const batch = updated.batches[updated.batches.length - 1];

    return {
      variantId: request.variantId,
      quantity: request.quantity,
      lotNumber: batch.lotNumber,
      batchId: batch.id,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('by-variant/:variantId')
  public async byVariant(
    @Param('variantId') variantId: string,
  ): Promise<{ quantity: number; minStock: number }> {
    const inventory =
      await this.findInventoryByVariantUseCase.execute(variantId);

    return { quantity: inventory.quantity, minStock: inventory.minStock };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sale')
  @Audit({
    entityType: 'inventory',
    action: AuditAction.UPDATE,
    entityId: responseId('variantId'),
  })
  public async sale(@Body() request: InternalSaleRequest): Promise<{
    variantId: string;
    quantity: number;
    deductions: { batchId: string; quantity: number }[];
  }> {
    let inventory: { id: string };

    try {
      inventory = await this.findInventoryByVariantUseCase.execute(
        request.variantId,
      );
    } catch (error) {
      if (!(error instanceof InventoryNotFoundException)) {
        throw error;
      }

      // Variant chưa từng nhập hàng → tạo kho trống để xử lý như hết hàng
      await this.createInventoryUseCase.execute({
        variantId: request.variantId,
        minStock: 0,
      });
      inventory = await this.findInventoryByVariantUseCase.execute(
        request.variantId,
      );
    }

    const deductions = await this.decreaseBatchStockUseCase.execute(
      inventory.id,
      { requestedQuantity: request.quantity },
    );

    return {
      variantId: request.variantId,
      quantity: request.quantity,
      deductions,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('reverse')
  @Audit({
    entityType: 'inventory',
    action: AuditAction.UPDATE,
    entityId: responseId('variantId'),
  })
  public async reverse(
    @Body() request: InternalReverseRequest,
  ): Promise<{ variantId: string; quantity: number }> {
    const inventory = await this.findInventoryByVariantUseCase.execute(
      request.variantId,
    );

    await this.reverseBatchStockUseCase.execute(inventory.id, {
      deductions: request.deductions,
    });

    return { variantId: request.variantId, quantity: request.quantity };
  }

  @HttpCode(HttpStatus.OK)
  @Post('restore')
  @Audit({
    entityType: 'inventory',
    action: AuditAction.UPDATE,
    entityId: responseId('variantId'),
  })
  public async restore(
    @Body() request: InternalRestoreStockRequest,
  ): Promise<{ variantId: string; quantity: number }> {
    const inventory = await this.findInventoryByVariantUseCase.execute(
      request.variantId,
    );

    await this.restoreBatchStockUseCase.execute(inventory.id, {
      variantId: request.variantId,
      quantity: request.quantity,
    });

    return { variantId: request.variantId, quantity: request.quantity };
  }
}

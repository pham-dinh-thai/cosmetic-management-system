import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { FindInventoryByVariantUseCase } from '../../application/use-cases/find-inventory-by-variant/find-inventory-by-variant.use-case';
import { AddBatchToInventoryUseCase } from '../../application/use-cases/add-batch-to-inventory/add-batch-to-inventory.use-case';
import { DecreaseBatchStockUseCase } from '../../application/use-cases/decrease-batch-stock/decrease-batch-stock.use-case';
import { InternalAddBatchRequest } from './requests/internal-add-batch.request';
import { InternalSaleRequest } from './requests/internal-sale.request';

@Controller('internal/inventories')
export class InternalInventoriesController {
  public constructor(
    private readonly findInventoryByVariantUseCase: FindInventoryByVariantUseCase,
    private readonly addBatchToInventoryUseCase: AddBatchToInventoryUseCase,
    private readonly decreaseBatchStockUseCase: DecreaseBatchStockUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('purchase')
  public async purchase(
    @Body() request: InternalAddBatchRequest,
  ): Promise<{ variantId: string; quantity: number; lotNumber: string }> {
    const inventory = await this.findInventoryByVariantUseCase.execute(
      request.variantId,
    );

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
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sale')
  public async sale(
    @Body() request: InternalSaleRequest,
  ): Promise<{ variantId: string; quantity: number }> {
    const inventory = await this.findInventoryByVariantUseCase.execute(
      request.variantId,
    );

    await this.decreaseBatchStockUseCase.execute(inventory.id, {
      requestedQuantity: request.quantity,
    });

    return { variantId: request.variantId, quantity: request.quantity };
  }
}
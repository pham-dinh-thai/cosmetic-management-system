import { Body, Controller, Post } from '@nestjs/common';
import { IncreaseInventoryUseCase } from 'apps/inventory-service/src/application/use-cases/increase-inventory/increase-inventory.use-case';
import { DecreaseInventoryUseCase } from 'apps/inventory-service/src/application/use-cases/decrease-inventory/decrease-inventory.use-case';
import { StockChangeRequest } from './requests/stock-change.request';

@Controller('internal/inventory')
export class InternalInventoryController {
  public constructor(
    private readonly increaseInventoryUseCase: IncreaseInventoryUseCase,
    private readonly decreaseInventoryUseCase: DecreaseInventoryUseCase,
  ) {}

  @Post('purchase')
  public async purchase(
    @Body() request: StockChangeRequest,
  ): Promise<{ variantId: string; quantity: number }> {
    return await this.increaseInventoryUseCase.execute(
      request.variantId,
      request.quantity,
    );
  }

  @Post('sale')
  public async sale(
    @Body() request: StockChangeRequest,
  ): Promise<{ variantId: string; quantity: number }> {
    return await this.decreaseInventoryUseCase.execute(
      request.variantId,
      request.quantity,
    );
  }
}

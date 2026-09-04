import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { FindAllInventoriesUseCase } from 'apps/inventory-service/src/application/use-cases/find-all-inventory/find-all-inventories.use-case';
import { InventoryReadModel } from 'apps/inventory-service/src/application/use-cases/find-all-inventory/read-models/inventory.read-model';
import { FindInventoryByVariantUseCase } from 'apps/inventory-service/src/application/use-cases/find-inventory-by-variant/find-inventory-by-variant.use-case';
import { AdjustInventoryUseCase } from 'apps/inventory-service/src/application/use-cases/adjust-inventory/adjust-inventory.use-case';
import { AdjustInventoryRequest } from './requests/adjust-inventory.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('inventory')
export class InventoryController {
  public constructor(
    private readonly findAllInventoriesUseCase: FindAllInventoriesUseCase,
    private readonly findInventoryByVariantUseCase: FindInventoryByVariantUseCase,
    private readonly adjustInventoryUseCase: AdjustInventoryUseCase,
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

  @HttpCode(HttpStatus.OK)
  @Patch(':id/adjust')
  public async adjust(
    @Param('id') id: string,
    @Body() request: AdjustInventoryRequest,
  ): Promise<{ id: string; quantity: number }> {
    return await this.adjustInventoryUseCase.execute(id, request.adjustment);
  }
}

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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { CreatePurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/create-purchase-order/create-purchase-order.use-case';
import { FindAllPurchaseOrdersUseCase } from 'apps/purchase-service/src/application/use-cases/find-all-purchase-orders/find-all-purchase-orders.use-case';
import { FindPurchaseOrderByIdUseCase } from 'apps/purchase-service/src/application/use-cases/find-purchase-order-by-id/find-purchase-order-by-id.use-case';
import { UpdatePurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/update-purchase-order/update-purchase-order.use-case';
import { CompletePurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/complete-purchase-order/complete-purchase-order.use-case';
import { CancelPurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/cancel-purchase-order/cancel-purchase-order.use-case';
import { DeletePurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/delete-purchase-order/delete-purchase-order.use-case';
import { PurchaseOrderDetailReadModel } from 'apps/purchase-service/src/application/use-cases/find-purchase-order-by-id/read-models/purchase-order-detail.read-model';
import { PurchaseOrderReadModel } from 'apps/purchase-service/src/application/use-cases/find-all-purchase-orders/read-models/purchase-order.read-model';
import { PurchaseOrderStatus } from 'apps/purchase-service/src/domain/types';
import { CreatePurchaseOrderRequest } from './requests/create-purchase-order.request';
import { UpdatePurchaseOrderRequest } from './requests/update-purchase-order.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  public constructor(
    private readonly createPurchaseOrderUseCase: CreatePurchaseOrderUseCase,
    private readonly findAllPurchaseOrdersUseCase: FindAllPurchaseOrdersUseCase,
    private readonly findPurchaseOrderByIdUseCase: FindPurchaseOrderByIdUseCase,
    private readonly updatePurchaseOrderUseCase: UpdatePurchaseOrderUseCase,
    private readonly completePurchaseOrderUseCase: CompletePurchaseOrderUseCase,
    private readonly cancelPurchaseOrderUseCase: CancelPurchaseOrderUseCase,
    private readonly deletePurchaseOrderUseCase: DeletePurchaseOrderUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('search') search?: string,
    @Query('status') status?: PurchaseOrderStatus,
    @Query('supplierId') supplierId?: string,
  ): Promise<PurchaseOrderReadModel[]> {
    return await this.findAllPurchaseOrdersUseCase.execute({
      search,
      status,
      supplierId,
    });
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<PurchaseOrderDetailReadModel> {
    return await this.findPurchaseOrderByIdUseCase.execute(id);
  }

  @Post()
  public async create(
    @Body() request: CreatePurchaseOrderRequest,
  ): Promise<{ id: string }> {
    return await this.createPurchaseOrderUseCase.execute(request);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdatePurchaseOrderRequest,
  ): Promise<void> {
    await this.updatePurchaseOrderUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/complete')
  public async complete(@Param('id') id: string): Promise<{ id: string }> {
    return await this.completePurchaseOrderUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/cancel')
  public async cancel(@Param('id') id: string): Promise<void> {
    await this.cancelPurchaseOrderUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deletePurchaseOrderUseCase.execute(id);
  }
}

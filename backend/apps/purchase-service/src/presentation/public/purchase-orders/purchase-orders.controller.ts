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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard, Departments, OrgGuard, Role, Roles } from '@app/security';
import { CreatePurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/create-purchase-order/create-purchase-order.use-case';
import { FindAllPurchaseOrdersUseCase } from 'apps/purchase-service/src/application/use-cases/find-all-purchase-orders/find-all-purchase-orders.use-case';
import { FindPurchaseOrderByIdUseCase } from 'apps/purchase-service/src/application/use-cases/find-purchase-order-by-id/find-purchase-order-by-id.use-case';
import { UpdatePurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/update-purchase-order/update-purchase-order.use-case';
import { CompletePurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/complete-purchase-order/complete-purchase-order.use-case';
import { CancelPurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/cancel-purchase-order/cancel-purchase-order.use-case';
import { DeletePurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/delete-purchase-order/delete-purchase-order.use-case';
import { FindPurchaseTransactionsUseCase } from 'apps/purchase-service/src/application/use-cases/find-purchase-transactions/find-purchase-transactions.use-case';
import { PrintPurchaseOrderUseCase } from 'apps/purchase-service/src/application/use-cases/print-purchase-order/print-purchase-order.use-case';
import { renderPurchaseReceiptHtml } from './receipt-html';
import { PurchaseOrderDetailReadModel } from 'apps/purchase-service/src/application/use-cases/find-purchase-order-by-id/read-models/purchase-order-detail.read-model';
import { PurchaseOrderReadModel } from 'apps/purchase-service/src/application/use-cases/find-all-purchase-orders/read-models/purchase-order.read-model';
import { PurchaseTransactionReadModel } from 'apps/purchase-service/src/application/use-cases/find-purchase-transactions/read-models/purchase-transaction.read-model';
import { PurchaseOrderStatus } from 'apps/purchase-service/src/domain/types';
import { CreatePurchaseOrderRequest } from './requests/create-purchase-order.request';
import { UpdatePurchaseOrderRequest } from './requests/update-purchase-order.request';

@UseGuards(AuthGuard, OrgGuard)
@Roles(Role.Admin, Role.Employee)
@Departments('warehouse')
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
    private readonly findPurchaseTransactionsUseCase: FindPurchaseTransactionsUseCase,
    private readonly printPurchaseOrderUseCase: PrintPurchaseOrderUseCase,
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

  @Get('transactions')
  public async findTransactions(
    @Query('purchaseOrderId') purchaseOrderId?: string,
    @Query('variantId') variantId?: string,
    @Query('employeeId') employeeId?: string,
  ): Promise<PurchaseTransactionReadModel[]> {
    return await this.findPurchaseTransactionsUseCase.execute({
      purchaseOrderId,
      variantId,
      employeeId,
    });
  }

  @Get(':id/print')
  public async print(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const receipt = await this.printPurchaseOrderUseCase.execute(id);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.send(renderPurchaseReceiptHtml(receipt));
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
    @Req() httpRequest: Request,
  ): Promise<{ id: string }> {
    const employeeId =
      (httpRequest as unknown as { user?: { sub?: string } }).user?.sub ?? '';
    return await this.createPurchaseOrderUseCase.execute(request, employeeId);
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
  public async complete(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ id: string }> {
    const employeeId =
      (request as unknown as { user?: { sub?: string } }).user?.sub ?? '';
    return await this.completePurchaseOrderUseCase.execute(id, employeeId);
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

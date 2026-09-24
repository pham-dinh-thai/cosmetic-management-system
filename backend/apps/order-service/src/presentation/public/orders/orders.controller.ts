import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard, PermissionsGuard, Permissions } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { FindAllOrdersUseCase } from 'apps/order-service/src/application/use-cases/find-all-orders/find-all-orders.use-case';
import { FindOrderByIdUseCase } from 'apps/order-service/src/application/use-cases/find-order-by-id/find-order-by-id.use-case';
import { PrintOrderUseCase } from 'apps/order-service/src/application/use-cases/print-order/print-order.use-case';
import { UpdateOrderUseCase } from 'apps/order-service/src/application/use-cases/update-order/update-order.use-case';
import { UpdateOrderStatusUseCase } from 'apps/order-service/src/application/use-cases/update-order-status/update-order-status.use-case';
import { UpdateOrderPaymentStatusUseCase } from 'apps/order-service/src/application/use-cases/update-order-payment-status/update-order-payment-status.use-case';
import { DeleteOrderUseCase } from 'apps/order-service/src/application/use-cases/delete-order/delete-order.use-case';
import { FindOrderTransactionsUseCase } from 'apps/order-service/src/application/use-cases/find-order-transactions/find-order-transactions.use-case';
import { OrderDetailReadModel } from 'apps/order-service/src/application/use-cases/find-order-by-id/read-models/order-detail.read-model';
import { OrderReadModel } from 'apps/order-service/src/application/use-cases/find-all-orders/read-models/order.read-model';
import { OrderTransactionReadModel } from 'apps/order-service/src/application/use-cases/find-order-transactions/read-models/order-transaction.read-model';
import { OrderStatus } from 'apps/order-service/src/domain/types';
import { UpdateOrderRequest } from './requests/update-order.request';
import { UpdateOrderStatusRequest } from './requests/update-order-status.request';
import { UpdateOrderPaymentStatusRequest } from './requests/update-order-payment-status.request';
import { renderOrderReceiptHtml } from './receipt-html';

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('orders:read')
@Controller('orders')
export class OrdersController {
  public constructor(
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly printOrderUseCase: PrintOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly updateOrderPaymentStatusUseCase: UpdateOrderPaymentStatusUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
    private readonly findOrderTransactionsUseCase: FindOrderTransactionsUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('search') search?: string,
    @Query('status') status?: OrderStatus,
    @Query('customerId') customerId?: string,
  ): Promise<OrderReadModel[]> {
    return await this.findAllOrdersUseCase.execute({
      search,
      status,
      customerId,
    });
  }

  @Get('transactions')
  public async findTransactions(
    @Query('orderId') orderId?: string,
    @Query('variantId') variantId?: string,
    @Query('employeeId') employeeId?: string,
  ): Promise<OrderTransactionReadModel[]> {
    return await this.findOrderTransactionsUseCase.execute({
      orderId,
      variantId,
      employeeId,
    });
  }

  @Get(':id/print')
  public async print(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const userId =
      (request as unknown as { user?: { sub?: string } }).user?.sub ??
      undefined;
    const receipt = await this.printOrderUseCase.execute(id, userId);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.send(renderOrderReceiptHtml(receipt));
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<OrderDetailReadModel> {
    return await this.findOrderByIdUseCase.execute(id);
  }

  @Permissions('orders:write')
  @Put(':id')
  @Audit({
    entityType: 'order',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateOrderRequest,
  ): Promise<void> {
    await this.updateOrderUseCase.execute(id, request);
  }

  @Permissions('orders:write')
  @HttpCode(HttpStatus.OK)
  @Patch(':id/status')
  @Audit({
    entityType: 'order',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async updateStatus(
    @Param('id') id: string,
    @Body() request: UpdateOrderStatusRequest,
    @Req() req: Request,
  ): Promise<{ id: string; status: OrderStatus }> {
    const employeeId =
      (req as unknown as { user?: { sub?: string } }).user?.sub ?? '';
    return await this.updateOrderStatusUseCase.execute(
      id,
      request.status,
      employeeId,
    );
  }

  @Permissions('orders:write')
  @HttpCode(HttpStatus.OK)
  @Patch(':id/payment-status')
  @Audit({
    entityType: 'order',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async updatePaymentStatus(
    @Param('id') id: string,
    @Body() request: UpdateOrderPaymentStatusRequest,
  ): Promise<{ id: string; status: OrderStatus; paymentStatus: string }> {
    return await this.updateOrderPaymentStatusUseCase.execute(
      id,
      request.paymentStatus,
    );
  }

  @Permissions('orders:write')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Audit({
    entityType: 'order',
    action: AuditAction.DELETE,
    entityId: paramId(),
  })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteOrderUseCase.execute(id);
  }
}

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
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { CreateOrderUseCase } from 'apps/order-service/src/application/use-cases/create-order/create-order.use-case';
import { FindAllOrdersUseCase } from 'apps/order-service/src/application/use-cases/find-all-orders/find-all-orders.use-case';
import { FindOrderByIdUseCase } from 'apps/order-service/src/application/use-cases/find-order-by-id/find-order-by-id.use-case';
import { UpdateOrderUseCase } from 'apps/order-service/src/application/use-cases/update-order/update-order.use-case';
import { CompleteOrderUseCase } from 'apps/order-service/src/application/use-cases/complete-order/complete-order.use-case';
import { CancelOrderUseCase } from 'apps/order-service/src/application/use-cases/cancel-order/cancel-order.use-case';
import { DeleteOrderUseCase } from 'apps/order-service/src/application/use-cases/delete-order/delete-order.use-case';
import { FindOrderTransactionsUseCase } from 'apps/order-service/src/application/use-cases/find-order-transactions/find-order-transactions.use-case';
import { OrderDetailReadModel } from 'apps/order-service/src/application/use-cases/find-order-by-id/read-models/order-detail.read-model';
import { OrderReadModel } from 'apps/order-service/src/application/use-cases/find-all-orders/read-models/order.read-model';
import { OrderTransactionReadModel } from 'apps/order-service/src/application/use-cases/find-order-transactions/read-models/order-transaction.read-model';
import { OrderStatus } from 'apps/order-service/src/domain/types';
import { CreateOrderRequest } from './requests/create-order.request';
import { UpdateOrderRequest } from './requests/update-order.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('orders')
export class OrdersController {
  public constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly completeOrderUseCase: CompleteOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
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

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<OrderDetailReadModel> {
    return await this.findOrderByIdUseCase.execute(id);
  }

  @Post()
  public async create(
    @Body() request: CreateOrderRequest,
  ): Promise<{ id: string }> {
    return await this.createOrderUseCase.execute(request);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateOrderRequest,
  ): Promise<void> {
    await this.updateOrderUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/complete')
  public async complete(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ id: string }> {
    const employeeId =
      (request as unknown as { user?: { sub?: string } }).user?.sub ?? '';
    return await this.completeOrderUseCase.execute(id, employeeId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/cancel')
  public async cancel(@Param('id') id: string): Promise<void> {
    await this.cancelOrderUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteOrderUseCase.execute(id);
  }
}

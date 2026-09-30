import {
  BadRequestException,
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
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  AuthGuard,
  CurrentUser,
  Permissions,
  PermissionsGuard,
} from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import {
  FindAllOrdersResponse,
  FindAllOrdersUseCase,
} from '../../../application/use-cases/find-all-orders/find-all-orders.use-case';
import { ViewOrderDetailUseCase } from '../../../application/use-cases/view-order-detail/view-order-detail.use-case';
import { ViewOrderDetailReadModel } from '../../../application/use-cases/view-order-detail/view-order-detail.read-model';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';
import { ConfirmOrderUseCase } from '../../../application/use-cases/confirm-order/confirm-order.use-case';
import { PrepareOrderUseCase } from '../../../application/use-cases/prepare-order/prepare-order.use-case';
import { ShipOrderUseCase } from '../../../application/use-cases/ship-order/ship-order.use-case';
import { DeliverOrderUseCase } from '../../../application/use-cases/deliver-order/deliver-order.use-case';
import { CompleteOrderUseCase } from '../../../application/use-cases/complete-order/complete-order.use-case';
import { CancelOrderUseCase } from '../../../application/use-cases/cancel-order/cancel-order.use-case';
import { DeliveryFailedOrderUseCase } from '../../../application/use-cases/delivery-failed-order/delivery-failed-order.use-case';
import { ReturnOrderUseCase } from '../../../application/use-cases/return-order/return-order.use-case';
import { RefundOrderUseCase } from '../../../application/use-cases/refund-order/refund-order.use-case';
import { PrintOrderUseCase } from '../../../application/use-cases/print-order/print-order.use-case';
import { UpdateOrderUseCase } from '../../../application/use-cases/update-order/update-order.use-case';
import { UpdateOrderPaymentStatusUseCase } from '../../../application/use-cases/update-order-payment-status/update-order-payment-status.use-case';
import { DeleteOrderUseCase } from '../../../application/use-cases/delete-order/delete-order.use-case';
import { OrderListQuery } from './queries/order-list.query';
import { UpdateOrderRequest } from './requests/update-order.request';
import { UpdateOrderPaymentStatusRequest } from './requests/update-order-payment-status.request';
import { UpdateOrderStatusRequest } from './requests/update-order-status.request';
import { renderOrderReceiptHtml } from './receipt-html';
import { OrderPaymentStatus } from '../../../../shared/domain/enums/order-payment-status.enum';

type ChangeOrderStatusHandler = (
  id: string,
  employeeId?: string,
) => Promise<{ id: string; status: OrderStatus }>;

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('orders:read')
@Controller('orders')
export class OrdersController {
  public constructor(
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly viewOrderDetailUseCase: ViewOrderDetailUseCase,
    private readonly confirmOrderUseCase: ConfirmOrderUseCase,
    private readonly prepareOrderUseCase: PrepareOrderUseCase,
    private readonly shipOrderUseCase: ShipOrderUseCase,
    private readonly deliverOrderUseCase: DeliverOrderUseCase,
    private readonly completeOrderUseCase: CompleteOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly deliveryFailedOrderUseCase: DeliveryFailedOrderUseCase,
    private readonly returnOrderUseCase: ReturnOrderUseCase,
    private readonly refundOrderUseCase: RefundOrderUseCase,
    private readonly printOrderUseCase: PrintOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly updateOrderPaymentStatusUseCase: UpdateOrderPaymentStatusUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
  ) {}

  private readonly statusHandlers: Partial<
    Record<OrderStatus, ChangeOrderStatusHandler>
  > = {
    [OrderStatus.CONFIRMED]: (id, employeeId) =>
      this.confirmOrderUseCase.execute(id, employeeId ?? ''),
    [OrderStatus.PREPARING]: (id) => this.prepareOrderUseCase.execute(id),
    [OrderStatus.SHIPPING]: (id, employeeId) =>
      this.shipOrderUseCase.execute(id, employeeId ?? ''),
    [OrderStatus.DELIVERED]: (id) => this.deliverOrderUseCase.execute(id),
    [OrderStatus.COMPLETED]: (id, employeeId) =>
      this.completeOrderUseCase.execute(id, employeeId ?? ''),
    [OrderStatus.CANCELLED]: (id) => this.cancelOrderUseCase.execute(id),
    [OrderStatus.DELIVERY_FAILED]: (id) =>
      this.deliveryFailedOrderUseCase.execute(id),
    [OrderStatus.RETURNED]: (id) => this.returnOrderUseCase.execute(id),
    [OrderStatus.REFUNDED]: (id) => this.refundOrderUseCase.execute(id),
  };

  @Get()
  public async findAll(
    @Query() query: OrderListQuery,
  ): Promise<FindAllOrdersResponse> {
    return await this.findAllOrdersUseCase.execute({
      search: query.search,
      status: query.status,
      customerId: query.customerId,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id/print')
  public async print(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string | undefined,
    @Res() response: Response,
  ): Promise<void> {
    const receipt = await this.printOrderUseCase.execute(id, userId);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.send(renderOrderReceiptHtml(receipt));
  }

  @Get(':id')
  public async viewDetail(
    @Param('id') id: string,
  ): Promise<ViewOrderDetailReadModel> {
    return await this.viewOrderDetailUseCase.execute(id);
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
  ): Promise<{ id: string }> {
    return await this.updateOrderUseCase.execute(id, request);
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
    @Body() body: UpdateOrderStatusRequest,
    @CurrentUser('sub') employeeId: string | undefined,
  ): Promise<{ id: string; status: OrderStatus }> {
    const handler = this.statusHandlers[body.status];

    if (!handler) {
      throw new BadRequestException(`Trạng thái không hợp lệ: ${body.status}`);
    }

    return await handler(id, employeeId ?? '');
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
  ): Promise<{
    id: string;
    status: OrderStatus;
    paymentStatus: OrderPaymentStatus;
  }> {
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

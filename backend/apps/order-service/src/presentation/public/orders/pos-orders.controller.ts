import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, PermissionsGuard, Permissions } from '@app/security';
import { Audit, AuditAction, responseId } from '@app/audit-client';
import { PosOrderUseCase } from 'apps/order-service/src/application/use-cases/pos-order/pos-order.use-case';
import { PosOrderRequest } from './requests/pos-order.request';

@Controller('orders')
export class PosOrdersController {
  public constructor(private readonly posOrderUseCase: PosOrderUseCase) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('orders:write')
  @HttpCode(HttpStatus.CREATED)
  @Post('pos')
  @Audit({
    entityType: 'order',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async place(@Body() request: PosOrderRequest): Promise<{
    id: string;
    status: string;
    total: number;
    paymentMethod: string;
  }> {
    const result = await this.posOrderUseCase.execute({
      customerId: request.customerId,
      items: request.items,
      paymentMethod: request.paymentMethod,
    });

    return {
      id: result.id,
      status: result.status,
      total: result.total,
      paymentMethod: result.paymentMethod,
    };
  }
}

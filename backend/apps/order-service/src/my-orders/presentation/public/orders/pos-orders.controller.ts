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
import { PlaceOrderUseCase } from '../../../application/use-cases/place-order/place-order.use-case';
import { PosOrderRequest } from './requests/pos-order.request';

@Controller('orders')
export class PosOrdersController {
  public constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {}

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
    const result = await this.placeOrderUseCase.execute(
      {
        customerId: request.customerId,
        lines: request.items,
        paymentMethod: request.paymentMethod,
      },
      'POS',
    );

    return {
      id: result.id,
      status: result.status ?? '',
      total: result.total ?? 0,
      paymentMethod: result.paymentMethod ?? '',
    };
  }
}

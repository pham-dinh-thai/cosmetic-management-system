import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Departments, OrgGuard, Role, Roles } from '@app/security';
import { PosOrderUseCase } from 'apps/order-service/src/application/use-cases/pos-order/pos-order.use-case';
import { PosOrderRequest } from './requests/pos-order.request';

@Controller('orders')
export class PosOrdersController {
  public constructor(private readonly posOrderUseCase: PosOrderUseCase) {}

  @UseGuards(AuthGuard, OrgGuard)
  @Roles(Role.Admin, Role.Employee)
  @Departments('sales')
  @HttpCode(HttpStatus.CREATED)
  @Post('pos')
  public async place(
    @Body() request: PosOrderRequest,
  ): Promise<{
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
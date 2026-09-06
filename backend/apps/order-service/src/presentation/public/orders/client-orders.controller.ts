import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { PlaceOrderUseCase } from 'apps/order-service/src/application/use-cases/place-order/place-order.use-case';
import { PlaceOrderRequest } from './requests/place-order.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Customer)
@Controller('orders')
export class ClientOrdersController {
  public constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('place')
  public async place(
    @Body() request: PlaceOrderRequest,
  ): Promise<{ id: string }> {
    return await this.placeOrderUseCase.execute(request);
  }
}

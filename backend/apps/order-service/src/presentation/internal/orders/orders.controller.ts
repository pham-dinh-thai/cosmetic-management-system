import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderUseCase } from 'apps/order-service/src/application/use-cases/create-order/create-order.use-case';
import { CreateOrderRequest } from 'apps/order-service/src/presentation/public/orders/requests/create-order.request';

@Controller('internal/orders')
export class InternalOrdersController {
  public constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  public async create(
    @Body() request: CreateOrderRequest,
  ): Promise<{ id: string }> {
    return await this.createOrderUseCase.execute(request);
  }
}

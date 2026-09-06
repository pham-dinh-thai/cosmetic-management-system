import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RemoveCartItemsUseCase } from 'apps/basket-service/src/application/use-cases/remove-cart-items/remove-cart-items.use-case';
import { RemoveCartItemsRequest } from './requests/remove-cart-items.request';

@Controller('internal/carts')
export class InternalCartsController {
  public constructor(
    private readonly removeCartItemsUseCase: RemoveCartItemsUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post(':customerId/items/remove')
  public async remove(
    @Param('customerId') customerId: string,
    @Body() body: RemoveCartItemsRequest,
  ): Promise<void> {
    await this.removeCartItemsUseCase.execute({
      customerId,
      lines: body.lines,
    });
  }
}

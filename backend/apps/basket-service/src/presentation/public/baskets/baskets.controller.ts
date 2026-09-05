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
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { GetCartUseCase } from 'apps/basket-service/src/application/use-cases/get-cart/get-cart.use-case';
import { CartReadModel } from 'apps/basket-service/src/application/use-cases/get-cart/get-cart.read-model';
import { AddCartItemUseCase } from 'apps/basket-service/src/application/use-cases/add-cart-item/add-cart-item.use-case';
import { UpdateCartItemUseCase } from 'apps/basket-service/src/application/use-cases/update-cart-item/update-cart-item.use-case';
import { RemoveCartItemUseCase } from 'apps/basket-service/src/application/use-cases/remove-cart-item/remove-cart-item.use-case';
import { CheckoutUseCase } from 'apps/basket-service/src/application/use-cases/checkout/checkout.use-case';
import { AddCartItemRequest } from './requests/add-cart-item.request';
import { UpdateCartItemRequest } from './requests/update-cart-item.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Customer)
@Controller('baskets')
export class BasketsController {
  public constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addCartItemUseCase: AddCartItemUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
    private readonly checkoutUseCase: CheckoutUseCase,
  ) {}

  private getUserId(request: Request): string {
    return (request as unknown as { user?: { sub?: string } }).user?.sub ?? '';
  }

  @Get('me')
  public async findCart(@Req() request: Request): Promise<CartReadModel> {
    return await this.getCartUseCase.execute({
      userId: this.getUserId(request),
    });
  }

  @Post('me/items')
  public async addItem(
    @Req() request: Request,
    @Body() body: AddCartItemRequest,
  ): Promise<CartReadModel> {
    await this.addCartItemUseCase.execute({
      userId: this.getUserId(request),
      variantId: body.variantId,
      quantity: body.quantity,
    });

    return await this.getCartUseCase.execute({
      userId: this.getUserId(request),
    });
  }

  @Patch('me/items/:variantId')
  public async updateItem(
    @Req() request: Request,
    @Param('variantId') variantId: string,
    @Body() body: UpdateCartItemRequest,
  ): Promise<CartReadModel> {
    await this.updateCartItemUseCase.execute({
      userId: this.getUserId(request),
      variantId,
      quantity: body.quantity,
    });

    return await this.getCartUseCase.execute({
      userId: this.getUserId(request),
    });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('me/items/:variantId')
  public async removeItem(
    @Req() request: Request,
    @Param('variantId') variantId: string,
  ): Promise<CartReadModel> {
    await this.removeCartItemUseCase.execute({
      userId: this.getUserId(request),
      variantId,
    });

    return await this.getCartUseCase.execute({
      userId: this.getUserId(request),
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('me/checkout')
  public async checkout(@Req() request: Request): Promise<{ orderId: string }> {
    return await this.checkoutUseCase.execute({
      userId: this.getUserId(request),
    });
  }
}

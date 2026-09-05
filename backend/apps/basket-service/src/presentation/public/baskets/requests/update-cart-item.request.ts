import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { IUpdateCartItemRequest } from 'apps/basket-service/src/application/use-cases/update-cart-item/update-cart-item.use-case';

export class UpdateCartItemRequest implements Omit<
  IUpdateCartItemRequest,
  'userId' | 'variantId'
> {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;
}

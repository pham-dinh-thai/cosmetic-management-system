import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { IAddCartItemRequest } from 'apps/basket-service/src/application/use-cases/add-cart-item/add-cart-item.use-case';

export class AddCartItemRequest implements Omit<IAddCartItemRequest, 'userId'> {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  variantId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}

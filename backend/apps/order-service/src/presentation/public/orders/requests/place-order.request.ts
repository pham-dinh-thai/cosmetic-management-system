import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateOrderLineRequest,
  IPlaceOrderRequest,
} from 'apps/order-service/src/application/use-cases/place-order/place-order.request';

class PlaceOrderLineRequest implements CreateOrderLineRequest {
  @ApiProperty()
  @IsUUID('4')
  variantId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class PlaceOrderRequest implements IPlaceOrderRequest {
  @ApiProperty()
  @IsUUID('4')
  customerId!: string;

  @ApiProperty({ type: [PlaceOrderLineRequest] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderLineRequest)
  lines!: CreateOrderLineRequest[];
}

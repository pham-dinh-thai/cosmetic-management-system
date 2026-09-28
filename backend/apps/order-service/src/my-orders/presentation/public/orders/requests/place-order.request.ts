import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderPaymentMethod } from '../../../../../shared/domain/enums/order-payment-method.enum';
import { IPlaceOrderRequest } from '../../../../application/use-cases/place-order/place-order.request';

class PlaceOrderLineRequest {
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
  lines!: { variantId: string; quantity: number }[];

  @ApiPropertyOptional({ enum: OrderPaymentMethod })
  @IsOptional()
  @IsIn(Object.values(OrderPaymentMethod))
  paymentMethod?: OrderPaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  recipientName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  recipientPhone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shippingAddress?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  shippingCity?: string | null;
}

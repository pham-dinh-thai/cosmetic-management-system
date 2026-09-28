import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderPaymentMethod } from '../../../../../shared/domain/enums/order-payment-method.enum';

class PosOrderItemRequest {
  @ApiProperty()
  @IsUUID('4')
  variantId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class PosOrderRequest {
  @ApiPropertyOptional({ description: 'Walk-in when omitted' })
  @IsOptional()
  @IsString()
  customerId?: string | null;

  @ApiProperty({ type: [PosOrderItemRequest] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PosOrderItemRequest)
  items!: { variantId: string; quantity: number }[];

  @ApiProperty({ enum: OrderPaymentMethod })
  @IsIn(Object.values(OrderPaymentMethod))
  paymentMethod!: OrderPaymentMethod;
}

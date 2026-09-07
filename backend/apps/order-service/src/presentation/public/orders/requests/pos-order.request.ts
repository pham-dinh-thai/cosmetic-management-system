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
import {
  type IPosOrderRequest,
  type PosOrderItem,
  type PosOrderPaymentMethod,
} from 'apps/order-service/src/application/use-cases/pos-order/pos-order.request';

class PosOrderItemRequest implements PosOrderItem {
  @ApiProperty()
  @IsUUID('4')
  variantId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class PosOrderRequest implements IPosOrderRequest {
  @ApiPropertyOptional({ description: 'Walk-in when omitted' })
  @IsOptional()
  @IsString()
  customerId?: string | null;

  @ApiProperty({ type: [PosOrderItemRequest] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PosOrderItemRequest)
  items!: PosOrderItem[];

  @ApiProperty({ enum: ['CASH', 'BANK_TRANSFER', 'CARD'] })
  @IsIn(['CASH', 'BANK_TRANSFER', 'CARD'])
  paymentMethod!: PosOrderPaymentMethod;
}
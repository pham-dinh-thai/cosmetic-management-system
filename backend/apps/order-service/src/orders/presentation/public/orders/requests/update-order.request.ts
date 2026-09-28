import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class UpdateOrderLineRequest {
  @IsUUID('4')
  variantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice!: number;
}

export class UpdateOrderRequest {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderLineRequest)
  lines!: UpdateOrderLineRequest[];
}

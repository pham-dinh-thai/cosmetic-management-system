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

class CreatePurchaseOrderLineRequest {
  @IsUUID('4')
  variantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice!: number;
}

export class CreatePurchaseOrderRequest {
  @IsUUID('4')
  supplierId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineRequest)
  lines!: CreatePurchaseOrderLineRequest[];
}

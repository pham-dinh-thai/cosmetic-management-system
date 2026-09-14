import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class UpdatePurchaseOrderLineRequest {
  @IsUUID('4')
  variantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice!: number;

  @IsDateString()
  @Type(() => Date)
  expiryDate!: Date;
}

export class UpdatePurchaseOrderRequest {
  @IsOptional()
  @IsUUID('4')
  supplierId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseOrderLineRequest)
  lines!: UpdatePurchaseOrderLineRequest[];
}

import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class RemoveCartItemLineRequest {
  @IsUUID('4')
  variantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class RemoveCartItemsRequest {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RemoveCartItemLineRequest)
  lines!: RemoveCartItemLineRequest[];
}

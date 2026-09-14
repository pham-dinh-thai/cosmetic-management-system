import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BatchDeductionDto {
  @ApiProperty({ description: 'Id của batch' })
  @IsUUID('4')
  batchId!: string;

  @ApiProperty({ description: 'Số lượng cần hoàn' })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class InternalReverseRequest {
  @ApiProperty({ description: 'Id của variant sản phẩm' })
  @IsUUID('4')
  variantId!: string;

  @ApiProperty({ description: 'Số lượng cần hoàn' })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: 'Danh sách batch đã trừ khi bán',
    type: [BatchDeductionDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BatchDeductionDto)
  deductions!: BatchDeductionDto[];
}

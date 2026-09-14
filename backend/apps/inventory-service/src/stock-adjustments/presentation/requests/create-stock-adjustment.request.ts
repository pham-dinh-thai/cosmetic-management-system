import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { STOCK_ADJUSTMENT_REASONS } from '../../domain/types';

export class CreateStockAdjustmentRequest {
  @ApiProperty({ description: 'ID của lô hàng' })
  @IsUUID()
  @IsNotEmpty()
  batchId!: string;

  @ApiProperty({
    description:
      'Số lượng điều chỉnh (âm: điều chỉnh giảm, dương: điều chỉnh tăng)',
  })
  @IsInt()
  adjustment!: number;

  @ApiProperty({
    description: 'Lý do điều chỉnh',
    enum: STOCK_ADJUSTMENT_REASONS,
  })
  @IsIn(STOCK_ADJUSTMENT_REASONS)
  reason!: (typeof STOCK_ADJUSTMENT_REASONS)[number];

  @ApiProperty({ description: 'Ghi chú', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  note!: string;
}
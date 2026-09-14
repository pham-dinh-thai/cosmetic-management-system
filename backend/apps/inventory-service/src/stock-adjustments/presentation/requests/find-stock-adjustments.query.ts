import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { STOCK_ADJUSTMENT_REASONS } from '../../domain/types';

export class FindStockAdjustmentsQuery {
  @ApiPropertyOptional({ description: 'ID variant' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiPropertyOptional({ description: 'ID lô hàng' })
  @IsOptional()
  @IsUUID()
  batchId?: string;

  @ApiPropertyOptional({
    description: 'Lý do điều chỉnh',
    enum: STOCK_ADJUSTMENT_REASONS,
  })
  @IsOptional()
  @IsIn(STOCK_ADJUSTMENT_REASONS)
  reason?: (typeof STOCK_ADJUSTMENT_REASONS)[number];
}
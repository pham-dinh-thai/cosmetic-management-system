import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  NotEquals,
} from 'class-validator';
import { STOCK_ADJUSTMENT_REASONS } from 'apps/inventory-service/src/domain/types';

export class AddStockAdjustmentRequest {
  @ApiProperty({ description: 'Cosmetic variant id' })
  @IsString()
  @IsNotEmpty()
  variantId!: string;

  @ApiProperty({
    description:
      'Signed delta applied to current stock. Negative to dispose (damaged / defective / expired / overstock), positive to restore.',
  })
  @IsInt()
  @NotEquals(0)
  adjustment!: number;

  @ApiProperty({ enum: [...STOCK_ADJUSTMENT_REASONS] })
  @IsIn([...STOCK_ADJUSTMENT_REASONS])
  reason!: string;

  @ApiProperty({ description: 'Optional note', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description:
      'Minimum stock threshold (reorder level). Only applied when creating a new inventory row; setting it again is a no-op.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minStock?: number;
}

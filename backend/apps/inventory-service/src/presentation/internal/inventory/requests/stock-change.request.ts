import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class StockChangeRequest {
  @ApiProperty()
  @IsUUID('4')
  variantId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({ description: 'Expiry date (YYYY-MM-DD) of the batch' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateInventoryMinStockRequest {
  @ApiProperty({ description: 'Minimum stock threshold (reorder level)' })
  @IsInt()
  @Min(0)
  minStock!: number;
}
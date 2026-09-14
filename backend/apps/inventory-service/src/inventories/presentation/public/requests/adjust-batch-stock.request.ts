import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AdjustBatchStockRequest {
  @ApiProperty({ description: 'Số lượng thực tế của lô sau khi kiểm kê' })
  @IsInt()
  @Min(0)
  adjustedQuantity!: number;
}

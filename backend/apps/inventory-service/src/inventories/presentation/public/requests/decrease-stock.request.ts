import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DecreaseStockRequest {
  @ApiProperty({ description: 'Số lượng muốn trừ (theo FEFO)' })
  @IsInt()
  @Min(1)
  requestedQuantity!: number;
}

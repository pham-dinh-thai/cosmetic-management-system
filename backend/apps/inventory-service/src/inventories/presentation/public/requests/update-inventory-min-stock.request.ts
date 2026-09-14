import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateInventoryMinStockRequest {
  @ApiProperty({ description: 'Mức tồn tối thiểu (mức đặt lại hàng)' })
  @IsInt()
  @Min(0)
  minStock!: number;
}

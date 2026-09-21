import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class InternalRestoreStockRequest {
  @ApiProperty({ description: 'Id của variant sản phẩm' })
  @IsUUID('4')
  variantId!: string;

  @ApiProperty({ description: 'Số lượng cần hoàn vào kho' })
  @IsInt()
  @Min(1)
  quantity!: number;
}

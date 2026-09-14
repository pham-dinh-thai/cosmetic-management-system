import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class InternalSaleRequest {
  @ApiProperty({ description: 'Id của variant sản phẩm' })
  @IsUUID('4')
  variantId!: string;

  @ApiProperty({ description: 'Số lượng bán ra' })
  @IsInt()
  @Min(1)
  quantity!: number;
}

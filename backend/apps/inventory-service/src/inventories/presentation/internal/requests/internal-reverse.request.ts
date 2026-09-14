import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class InternalReverseRequest {
  @ApiProperty({ description: 'Id của variant sản phẩm' })
  @IsUUID('4')
  variantId!: string;

  @ApiProperty({ description: 'Số lượng hoàn trả' })
  @IsInt()
  @Min(1)
  quantity!: number;
}
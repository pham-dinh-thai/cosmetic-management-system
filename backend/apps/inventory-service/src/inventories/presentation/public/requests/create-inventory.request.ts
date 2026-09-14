import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateInventoryRequest {
  @ApiProperty({ description: 'Id của variant sản phẩm' })
  @IsUUID('4')
  variantId!: string;

  @ApiProperty({ description: 'Mức tồn tối thiểu', default: 0 })
  @IsInt()
  @Min(0)
  minStock!: number;
}

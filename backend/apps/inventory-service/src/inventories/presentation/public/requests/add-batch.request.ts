import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsUUID, Min } from 'class-validator';

export class AddBatchRequest {
  @ApiProperty({ description: 'Id nhà cung cấp' })
  @IsUUID('4')
  supplierId!: string;

  @ApiProperty({ description: 'Số lượng nhập vào lô' })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ description: 'Ngày hết hạn của lô (YYYY-MM-DD)' })
  @IsDateString()
  expiredDate!: string;
}

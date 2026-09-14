import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class InternalAddBatchRequest {
  @ApiProperty({ description: 'Id của variant sản phẩm' })
  @IsUUID('4')
  variantId!: string;

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

  @ApiPropertyOptional({ description: 'Id người tạo lô' })
  @IsOptional()
  @IsUUID('4')
  createdBy?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IUpdateCosmeticRequest } from 'apps/cosmetic-service/src/application/use-cases/update-cosmetic/update-cosmetic.request';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
} from 'class-validator';

export class UpdateCosmeticRequest implements IUpdateCosmeticRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Tên mỹ phẩm không được dài quá 255 ký tự' })
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Tên thương hiệu không được dài quá 255 ký tự' })
  brand?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Xuất xứ không được dài quá 255 ký tự' })
  origin?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Mô tả không được dài quá 1000 ký tự' })
  description?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { ICreateCosmeticRequest } from 'apps/cosmetic-service/src/application/use-cases/create-cosmetic/create-cosmetic.request';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateVariantRequest } from './create-variant.request';

export class CreateCosmeticRequest implements ICreateCosmeticRequest {
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
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Độ dài file url không được dài quá 500 ký tự' })
  imageUrl?: string;

  @ApiProperty({ type: [CreateVariantRequest] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantRequest)
  variants!: CreateVariantRequest[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds!: string[];
}

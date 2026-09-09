import { ApiProperty } from '@nestjs/swagger';
import { ICreateVariantRequest } from 'apps/cosmetic-service/src/application/use-cases/create-cosmetic/create-cosmetic.request';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVariantRequest implements ICreateVariantRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Tên biến thể không được dài quá 255 ký tự' })
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Màu không được dài quá 255 ký tự' })
  color?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Dung tích không được dài quá 50 ký tự' })
  volume?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Giá không được nhỏ hơn 0' })
  price!: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Giá không được nhỏ hơn 0' })
  costPrice?: number;
}

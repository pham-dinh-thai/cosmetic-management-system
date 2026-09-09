import { ApiProperty } from '@nestjs/swagger';
import { IAddVariantRequest } from 'apps/cosmetic-service/src/application/use-cases/add-variant/add-variant.request';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class AddVariantRequest implements IAddVariantRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Tên biến thể không được bỏ trống' })
  @MaxLength(255, {
    message: 'Không được dài quá 255 ký tự',
  })
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Không được dài quá 50 ký tự' })
  color?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Không được dài quá 50 ký tự' })
  volume?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Giá không thể nhỏ hơn 0' })
  price!: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Giá không thể nhỏ hơn 0' })
  costPrice?: number;
}

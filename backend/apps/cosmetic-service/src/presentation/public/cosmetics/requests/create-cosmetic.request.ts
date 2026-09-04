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
  @MaxLength(255)
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  brand?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  origin?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
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

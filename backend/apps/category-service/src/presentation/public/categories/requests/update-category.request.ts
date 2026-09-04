import { ApiProperty } from '@nestjs/swagger';
import { IUpdateCategoryRequest } from 'apps/category-service/src/application/use-cases/update-category/update-category.request';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryRequest implements IUpdateCategoryRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}

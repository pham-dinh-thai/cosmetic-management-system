import { ApiProperty } from '@nestjs/swagger';
import { ICreateCategoryRequest } from 'apps/category-service/src/application/use-cases/create-category/create-category.request';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryRequest implements ICreateCategoryRequest {
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

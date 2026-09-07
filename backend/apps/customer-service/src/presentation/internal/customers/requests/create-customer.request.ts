import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ICreateCustomerRequest } from '../../../../application/use-cases/create-customer/create-customer.request';

export class CreateCustomerRequest implements ICreateCustomerRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateCustomerRequest } from 'apps/customer-service/src/application/use-cases/create-customer/create-customer.request';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

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
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

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

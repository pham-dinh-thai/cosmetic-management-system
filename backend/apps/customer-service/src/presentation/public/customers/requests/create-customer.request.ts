import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateCustomerRequest } from 'apps/customer-service/src/application/use-cases/create-customer/create-customer.request';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateCustomerUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  roleId!: string;
}

export class CreateCustomerRequest implements ICreateCustomerRequest {
  @ApiProperty({ type: CreateCustomerUserDto })
  @ValidateNested()
  @Type(() => CreateCustomerUserDto)
  user!: CreateCustomerUserDto;

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

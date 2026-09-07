import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUpdateCustomerRequest } from 'apps/customer-service/src/application/use-cases/update-customer/update-customer.request';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateCustomerUserDto {
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
}

export class UpdateCustomerRequest implements IUpdateCustomerRequest {
  @ApiProperty({ type: UpdateCustomerUserDto })
  @ValidateNested()
  @Type(() => UpdateCustomerUserDto)
  user!: UpdateCustomerUserDto;

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
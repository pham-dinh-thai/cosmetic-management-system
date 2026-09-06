import { ApiProperty } from '@nestjs/swagger';
import { IUpdateCustomerRequest } from 'apps/customer-service/src/application/use-cases/update-customer/update-customer.request';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCustomerRequest implements IUpdateCustomerRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  phone!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string;
}

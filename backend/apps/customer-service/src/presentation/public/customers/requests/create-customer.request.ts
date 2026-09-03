import { ApiProperty } from '@nestjs/swagger';
import { ICreateCustomerRequest } from 'apps/customer-service/src/application/use-cases/create-customer/create-customer.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCustomerRequest implements ICreateCustomerRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  code!: string;
}

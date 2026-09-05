import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ICreateCustomerRequest } from '../../../../application/use-cases/create-customer/create-customer.request';

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

import { ApiProperty } from '@nestjs/swagger';
import { IUpdateCustomerRequest } from 'apps/customer-service/src/application/use-cases/update-customer/update-customer.request';
import {
  IsDefined,
  IsNotEmpty,
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
  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateCustomerUserDto)
  user!: UpdateCustomerUserDto;
}

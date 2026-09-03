import { ApiProperty } from '@nestjs/swagger';
import { IAddAddressRequest } from 'apps/customer-service/src/application/use-cases/add-address/add-address.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddAddressRequest implements IAddAddressRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  city!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street!: string;
}

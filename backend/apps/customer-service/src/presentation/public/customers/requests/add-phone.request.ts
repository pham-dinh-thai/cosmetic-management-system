import { ApiProperty } from '@nestjs/swagger';
import { IAddPhoneRequest } from 'apps/customer-service/src/application/use-cases/add-phone/add-phone.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddPhoneRequest implements IAddPhoneRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  phone!: string;
}

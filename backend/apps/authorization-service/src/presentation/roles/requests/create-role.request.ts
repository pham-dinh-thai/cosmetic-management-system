import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ICreateRoleRequest } from '../../../application/use-cases/create-role/create-role.request';

export class CreateRoleRequest implements ICreateRoleRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}

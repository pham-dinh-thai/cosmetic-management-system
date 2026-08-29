import { ApiProperty } from '@nestjs/swagger';
import { ICreateRoleRequest } from 'apps/authorization-service/src/application/use-cases/create-role/create-role.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleRequest implements ICreateRoleRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}

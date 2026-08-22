import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ICreateRoleRequest } from '../../../application/use-cases/create-role/create-role.request';

export class CreateRoleRequest implements ICreateRoleRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IUpdateUserRoleRequest } from 'apps/user-service/src/application/use-cases/update-user-role/update-user-role.request';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserRoleRequest implements IUpdateUserRoleRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  roleId: string;
}

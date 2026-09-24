import { ApiProperty } from '@nestjs/swagger';
import { IGrantPermissionToRoleRequest } from 'apps/authorization-service/src/application/use-cases/grant-permission-to-role/grant-permission-to-role.request';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class GrantPermissionsRequest implements IGrantPermissionToRoleRequest {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionIds!: string[];
}

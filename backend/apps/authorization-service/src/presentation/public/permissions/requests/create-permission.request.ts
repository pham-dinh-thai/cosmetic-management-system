import { ICreatePermissionRequest } from 'apps/authorization-service/src/application/use-cases/create-permission/create-permission.request';
import { Action } from 'apps/authorization-service/src/domain/permission/enums/action.enum';
import { Resource } from 'apps/authorization-service/src/domain/permission/enums/resource.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreatePermissionRequest implements ICreatePermissionRequest {
  @IsEnum(Resource)
  @IsNotEmpty({ message: 'Tài nguyên không được để trống' })
  resource!: Resource;

  @IsEnum(Action)
  @IsNotEmpty({ message: 'Hành động không được để trống' })
  action!: Action;
}

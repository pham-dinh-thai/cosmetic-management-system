import { Action } from 'apps/authorization-service/src/domain/permission/enums/action.enum';
import { Resource } from 'apps/authorization-service/src/domain/permission/enums/resource.enum';

export interface ICreatePermissionRequest {
  resource: Resource;
  action: Action;
}

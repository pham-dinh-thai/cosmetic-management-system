import { Action } from 'apps/authorization-service/src/domain/permission/enums/action.enum';
import { Resource } from 'apps/authorization-service/src/domain/permission/enums/resource.enum';

export type FindRoleByIdPermissionReadModel = {
  id: string;
  resource: Resource;
  action: Action;
  isActive: boolean;
};

export class FindRoleByIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly permissions: FindRoleByIdPermissionReadModel[],
  ) {}
}

import { Action } from 'apps/authorization-service/src/domain/permission/enums/action.enum';
import { Resource } from 'apps/authorization-service/src/domain/permission/enums/resource.enum';

export class FindAllPermissionsReadModel {
  public constructor(
    public readonly id: string,
    public readonly resource: Resource,
    public readonly action: Action,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

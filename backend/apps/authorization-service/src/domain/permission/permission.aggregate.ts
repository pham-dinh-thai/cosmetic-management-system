import { Action } from './enums/action.enum';
import { Resource } from './enums/resource.enum';

export type CreatePermissionProps = {
  resource: Resource;
  action: Action;
};

export type FromPersistentPermissionProps = {
  id: string;
  resource: Resource;
  action: Action;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class Permission {
  private constructor(
    private readonly id: string,
    private readonly resource: Resource,
    private readonly action: Action,
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(props: CreatePermissionProps): Permission {
    const id = `${props.resource}:${props.action}`;

    return new Permission(
      id,
      props.resource,
      props.action,
      true,
      new Date(),
      new Date(),
    );
  }

  public static fromPersistent(
    props: FromPersistentPermissionProps,
  ): Permission {
    return new Permission(
      props.id,
      props.resource,
      props.action,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getResource(): Resource {
    return this.resource;
  }

  public getAction(): Action {
    return this.action;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}

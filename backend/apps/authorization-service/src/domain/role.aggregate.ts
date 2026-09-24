import { PermissionDeactivatedException } from './exceptions/permission-deactivated.exception';
import { PermissionNotFoundException } from './exceptions/permission-not-found.exception';
import { RoleDeactivatedException } from './exceptions/role-deactivated.exception';
import { Action } from './permission/enums/action.enum';
import { Resource } from './permission/enums/resource.enum';
import { Permission } from './permission/permission.aggregate';

export type PermissionProps = {
  id: string;
  resource: Resource;
  action: Action;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FromPersistentRoleProps = {
  id: string;
  name: string;
  permissions: PermissionProps[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class Role {
  public constructor(
    private readonly id: string,
    private name: string,
    private permissions: Permission[],
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(name: string): Role {
    const trimmedName = name.trim();

    const id = Role.formatId(trimmedName);
    const formattedName = Role.formatName(trimmedName);

    return new Role(id, formattedName, [], true, new Date(), new Date());
  }

  public static fromPersistent(props: FromPersistentRoleProps): Role {
    return new Role(
      props.id,
      props.name,
      props.permissions.map((permission: PermissionProps) =>
        Permission.fromPersistent({
          id: permission.id,
          resource: permission.resource,
          action: permission.action,
          isActive: permission.isActive,
          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        }),
      ),
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  public grantPermission(requestedPermission: Permission): void {
    if (!this.isActive) {
      throw new RoleDeactivatedException(this.id);
    }

    if (!requestedPermission.getIsActive()) {
      throw new PermissionDeactivatedException(requestedPermission.getId());
    }

    const existing = this.permissions.find(
      (permission) => permission.getId() === requestedPermission.getId(),
    );

    if (existing) {
      return;
    }

    this.permissions.push(requestedPermission);
  }

  public clearPermissions(): void {
    this.permissions = [];
  }

  public revokePermission(permissionId: string): void {
    if (!this.isActive) {
      throw new RoleDeactivatedException(this.id);
    }

    const next = this.permissions.filter(
      (permission) => permission.getId() !== permissionId,
    );

    if (next.length === this.permissions.length) {
      throw new PermissionNotFoundException(permissionId);
    }

    this.permissions = next;
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

  public getName(): string {
    return this.name;
  }

  public getPermissions(): Permission[] {
    return [...this.permissions];
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

  private static formatId(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
  }

  private static formatName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

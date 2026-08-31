import { EmployeeStatus } from './employee/enums/employee-status.enum';
import { Position } from './employee/enums/position.enum';
import { EmployeeNotActiveException } from './exceptions/employee-not-active.exception';
import { EmployeeNotManagerException } from './exceptions/employee-not-manager.exception';
import {
  AssignManagerProps,
  CreateDepartmentProps,
  FromPersistentDepartmentProps,
} from './types';

export class Department {
  public constructor(
    private readonly id: string,
    private code: string,
    private name: string,
    private isActive: boolean,
    private managerId?: string,
  ) {}

  public static create(props: CreateDepartmentProps): Department {
    return new Department(
      undefined as unknown as string,
      props.code,
      props.name,
      true,
    );
  }

  public static fromPersistent(
    props: FromPersistentDepartmentProps,
  ): Department {
    return new Department(
      props.id,
      props.code,
      props.name,
      true,
      props.managerId,
    );
  }

  public updateCode(code: string): void {
    this.code = code;
  }

  public updateName(name: string): void {
    this.name = name;
  }

  public assignManager(props: AssignManagerProps): void {
    if (props.status !== EmployeeStatus.ACTIVE) {
      throw new EmployeeNotActiveException(props.employeeId);
    }

    if (props.position !== Position.Manager) {
      throw new EmployeeNotManagerException(props.employeeId);
    }

    this.managerId = props.employeeId;
  }

  public getId(): string {
    return this.id;
  }

  public getCode(): string {
    return this.code;
  }

  public getName(): string {
    return this.name;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getManagerId(): string | null {
    return this.managerId ?? null;
  }
}

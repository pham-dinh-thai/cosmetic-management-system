import { EmployeeStatus } from './enums/employee-status.enum';
import { Position } from './enums/position.enum';
import { CreateEmployeeProps, FromPersistentEmployeeProps } from './types';

export class Employee {
  public constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly code: string,
    private departmentId: string,
    private hiredAt: Date,
    private status: EmployeeStatus,
    private position: Position,
    private phone?: string,
    private address?: string,
  ) {}

  public static create(props: CreateEmployeeProps): Employee {
    return new Employee(
      undefined as unknown as string,
      props.userId,
      props.code,
      props.departmentId,
      props.hiredAt,
      EmployeeStatus.ACTIVE,
      props.position,
      props.phone,
      props.address,
    );
  }

  public static fromPersistent(props: FromPersistentEmployeeProps): Employee {
    return new Employee(
      props.id,
      props.userId,
      props.code,
      props.departmentId,
      props.hiredAt,
      props.status,
      props.position,
      props.phone,
      props.address,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getCode(): string {
    return this.code;
  }

  public getDepartmentId(): string {
    return this.departmentId;
  }

  public getHiredAt(): Date {
    return this.hiredAt;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getStatus(): EmployeeStatus {
    return this.status;
  }

  public getPhone(): string | undefined {
    return this.phone;
  }

  public getAddress(): string | undefined {
    return this.address;
  }
}

import { EmployeeStatus } from './enums/employee-status.enum';
import { Position } from './enums/position.enum';
import { CannotUpdatePositionForEmployeeException } from './exceptions/cannot-update-position-for-employee.exception';
import { CreateEmployeeProps, FromPersistentEmployeeProps } from './types';
import { EmployeePhone } from './value-objects/employee-phone.value-object';

export class Employee {
  public constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly code: string,
    private departmentId: string,
    private hiredAt: Date,
    private status: EmployeeStatus,
    private position: Position,
    private phone?: EmployeePhone,
    private address?: string,
    private createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  public static create(props: CreateEmployeeProps): Employee {
    return new Employee(
      undefined as unknown as string, // Let the persistence layer auto generate it
      props.userId,
      props.code,
      props.departmentId,
      props.hiredAt,
      EmployeeStatus.ACTIVE,
      props.position,
      props.phone ? EmployeePhone.create(props.phone) : undefined,
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
      props.phone ? EmployeePhone.fromPersistent(props.phone) : undefined,
      props.address,
      props.createdAt,
      props.updatedAt,
    );
  }

  public updatePhone(phone: string): void {
    this.phone = EmployeePhone.create(phone);
  }

  public updateAddress(address: string): void {
    this.address = address;
  }

  public updatePosition(position: Position): void {
    if (this.status !== EmployeeStatus.ACTIVE) {
      throw new CannotUpdatePositionForEmployeeException(this.id, this.status);
    }

    this.position = position;
  }

  public assignDepartment(departmentId: string): void {
    this.departmentId = departmentId;
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
    return this.phone?.getValue();
  }

  public getAddress(): string | undefined {
    return this.address;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}

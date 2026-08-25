import { CreateDepartmentProps } from './types';

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
      props.id,
      props.code,
      props.name,
      true,
      props.managerId,
    );
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

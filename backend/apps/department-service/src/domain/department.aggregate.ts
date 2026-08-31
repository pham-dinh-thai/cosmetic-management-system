import { CreateDepartmentProps, FromPersistentDepartmentProps } from './types';

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

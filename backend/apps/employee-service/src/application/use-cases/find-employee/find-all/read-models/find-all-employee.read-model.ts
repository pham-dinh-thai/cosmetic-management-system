export class FindAllEmployeeReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly code: string,
    public readonly departmentId: string,
    public readonly hiredAt: Date,
    public readonly status: string,
    public readonly position: string,
    public readonly phone?: string,
    public readonly address?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly gender?: string,
    public readonly email?: string,
  ) {}
}
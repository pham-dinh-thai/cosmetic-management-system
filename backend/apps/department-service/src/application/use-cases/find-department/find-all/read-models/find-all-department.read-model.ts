export class FindAllDepartmentReadModel {
  public constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly positions: string[],
    public readonly managerId?: string | null,
  ) {}
}

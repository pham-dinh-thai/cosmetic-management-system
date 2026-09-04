export class FindCategoryByIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined,
  ) {}
}

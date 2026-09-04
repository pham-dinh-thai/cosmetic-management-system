export class FindAllSupplierReadModel {
  public constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined,
  ) {}
}

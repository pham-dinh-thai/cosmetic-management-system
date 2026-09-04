export class FindAllCosmeticReadModel {
  public constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly brand: string | null,
    public readonly origin: string | null,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly variantCount: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined,
  ) {}
}

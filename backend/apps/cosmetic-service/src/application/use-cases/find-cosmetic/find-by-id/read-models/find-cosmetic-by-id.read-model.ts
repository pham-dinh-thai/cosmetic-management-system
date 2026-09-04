export class FindCosmeticByIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly brand: string | null,
    public readonly origin: string | null,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly variants: {
      id: string;
      name: string;
      color: string | null;
      volume: string | null;
      price: number;
      costPrice: number | null;
      isActive: boolean;
    }[],
    public readonly categoryIds: string[],
    public readonly isActive: boolean,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined,
  ) {}
}

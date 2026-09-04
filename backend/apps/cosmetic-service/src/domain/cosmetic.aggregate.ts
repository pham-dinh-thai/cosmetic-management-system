import { CosmeticVariant } from './entities/cosmetic-variant.entity';
import { CosmeticCode } from './value-objects/cosmetic-code.value-object';
import { CreateCosmeticProps, FromPersistentCosmeticProps } from './types';

export class Cosmetic {
  private constructor(
    private readonly id: string,
    private readonly code: CosmeticCode,
    private name: string,
    private brand: string | null,
    private origin: string | null,
    private description: string | null,
    private imageUrl: string | null,
    private variants: CosmeticVariant[],
    private categoryIds: string[],
    private isActive: boolean,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateCosmeticProps): Cosmetic {
    return new Cosmetic(
      undefined as unknown as string,
      CosmeticCode.fromPersistent(props.code),
      props.name,
      props.brand,
      props.origin,
      props.description,
      props.imageUrl,
      props.variants.map((variant) => CosmeticVariant.create(variant)),
      props.categoryIds,
      true,
    );
  }

  public static fromPersistent(props: FromPersistentCosmeticProps): Cosmetic {
    return new Cosmetic(
      props.id,
      CosmeticCode.fromPersistent(props.code),
      props.name,
      props.brand,
      props.origin,
      props.description,
      props.imageUrl,
      props.variants.map((variant) => CosmeticVariant.fromPersistent(variant)),
      props.categoryIds,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }

  public getId(): string {
    return this.id;
  }

  public getCode(): string {
    return this.code.getValue();
  }

  public getName(): string {
    return this.name;
  }

  public getBrand(): string | null {
    return this.brand;
  }

  public getOrigin(): string | null {
    return this.origin;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getImageUrl(): string | null {
    return this.imageUrl;
  }

  public getVariants(): CosmeticVariant[] {
    return [...this.variants];
  }

  public getVariantCount(): number {
    return this.variants.length;
  }

  public getCategoryIds(): string[] {
    return [...this.categoryIds];
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}

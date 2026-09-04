import { NegativePriceException } from '../exceptions/negative-price.exception';
import { CreateVariantProps, FromPersistentVariantProps } from '../types';

export class CosmeticVariant {
  private constructor(
    private readonly id: string,
    private readonly cosmeticId: string,
    private name: string,
    private color: string | null,
    private volume: string | null,
    private price: number,
    private costPrice: number | null,
    private isActive: boolean,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateVariantProps): CosmeticVariant {
    this.validatePrice(props.price);
    this.validatePrice(props.costPrice);

    return new CosmeticVariant(
      undefined as unknown as string,
      undefined as unknown as string,
      props.name,
      props.color,
      props.volume,
      props.price,
      props.costPrice,
      true,
    );
  }

  public static fromPersistent(
    props: FromPersistentVariantProps,
  ): CosmeticVariant {
    return new CosmeticVariant(
      props.id,
      props.cosmeticId,
      props.name,
      props.color,
      props.volume,
      props.price,
      props.costPrice,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  private static validatePrice(value: number | null): void {
    if (value !== null && value < 0) {
      throw new NegativePriceException(value);
    }
  }

  public getId(): string {
    return this.id;
  }

  public getCosmeticId(): string {
    return this.cosmeticId;
  }

  public getName(): string {
    return this.name;
  }

  public getColor(): string | null {
    return this.color;
  }

  public getVolume(): string | null {
    return this.volume;
  }

  public getPrice(): number {
    return this.price;
  }

  public getCostPrice(): number | null {
    return this.costPrice;
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

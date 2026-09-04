import { Cosmetic } from '../../domain/cosmetic.aggregate';
import { Cosmetic as CosmeticMikro } from '../entities/cosmetic.entity';

export class CosmeticsMapper {
  public static toDomain(cosmeticMikro: CosmeticMikro): Cosmetic {
    return Cosmetic.fromPersistent({
      id: cosmeticMikro.id,
      code: cosmeticMikro.code,
      name: cosmeticMikro.name,
      brand: cosmeticMikro.brand ?? null,
      origin: cosmeticMikro.origin ?? null,
      description: cosmeticMikro.description ?? null,
      imageUrl: cosmeticMikro.imageUrl ?? null,
      variants: cosmeticMikro.variants.getItems().map((variant) => ({
        id: variant.id,
        cosmeticId: variant.cosmetic.id,
        name: variant.name,
        color: variant.color ?? null,
        volume: variant.volume ?? null,
        price: variant.price,
        costPrice: variant.costPrice ?? null,
        isActive: variant.isActive,
        createdAt: variant.createdAt,
        updatedAt: variant.updatedAt,
      })),
      categoryIds: cosmeticMikro.categories
        .getItems()
        .map((category) => category.categoryId),
      isActive: cosmeticMikro.isActive,
      createdAt: cosmeticMikro.createdAt,
      updatedAt: cosmeticMikro.updatedAt,
    });
  }
}

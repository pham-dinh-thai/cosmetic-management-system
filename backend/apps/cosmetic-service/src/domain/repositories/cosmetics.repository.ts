import { Cosmetic } from '../cosmetic.aggregate';

export type CreateVariantData = {
  name: string;
  color: string | null;
  volume: string | null;
  price: number;
  costPrice: number | null;
};

export type UpdateVariantData = {
  name: string;
  color: string | null;
  volume: string | null;
  price: number;
  costPrice: number | null;
};

export interface ICosmeticsRepository {
  findAll(search?: string): Promise<Cosmetic[]>;

  findById(id: string): Promise<Cosmetic | null>;

  findMaxCodeSequence(): Promise<number | null>;

  create(cosmetic: Cosmetic): Promise<{ id: string }>;

  update(
    id: string,
    data: {
      name: string;
      brand: string | null;
      origin: string | null;
      description: string | null;
      imageUrl?: string | null;
      categoryIds?: string[];
    },
  ): Promise<Cosmetic | null>;

  updateImage(id: string, imageUrl: string): Promise<Cosmetic | null>;

  activate(id: string): Promise<Cosmetic | null>;

  deactivate(id: string): Promise<Cosmetic | null>;

  delete(id: string): Promise<Cosmetic | null>;

  addVariant(
    cosmeticId: string,
    variant: CreateVariantData,
  ): Promise<{ id: string }>;

  updateVariant(
    variantId: string,
    variant: UpdateVariantData,
  ): Promise<{ id: string } | null>;

  activateVariant(variantId: string): Promise<{ id: string } | null>;

  deactivateVariant(variantId: string): Promise<{ id: string } | null>;

  findVariantById(
    variantId: string,
  ): Promise<{ id: string; name: string; price: number } | null>;

  findVariantsByIds(
    ids: string[],
  ): Promise<{ id: string; name: string; cosmeticName: string }[]>;
}

export const COSMETICS_REPOSITORY = 'ICosmeticsRepository';

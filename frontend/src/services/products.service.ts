import api from "../config/axios";

export interface CosmeticSummary {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  origin: string | null;
  description: string | null;
  imageUrl: string | null;
  variantCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVariantPayload {
  name: string;
  color?: string;
  volume?: string;
  price: number;
  costPrice?: number;
}

export interface CreateCosmeticPayload {
  name: string;
  brand?: string;
  origin?: string;
  description?: string;
  imageUrl?: string;
  variants: CreateVariantPayload[];
  categoryIds: string[];
}

export const productsService = {
  async getCosmetics(search?: string): Promise<CosmeticSummary[]> {
    const { data } = await api.get<CosmeticSummary[]>("/cosmetics", {
      params: search ? { search } : undefined,
    });
    return data;
  },

  async getCategories(): Promise<CategorySummary[]> {
    const { data } = await api.get<CategorySummary[]>("/categories");
    return data;
  },

  async createCosmetic(payload: CreateCosmeticPayload): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>("/cosmetics", payload);
    return data;
  },

  async deleteCosmetic(id: string): Promise<void> {
    await api.delete<void>(`/cosmetics/${id}`);
  },
};
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

export interface CosmeticDetailVariant {
  id: string;
  name: string;
  color: string | null;
  volume: string | null;
  price: number;
  costPrice: number | null;
  isActive: boolean;
  quantity: number;
  minStock: number;
}

export interface CosmeticDetail {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  origin: string | null;
  description: string | null;
  imageUrl: string | null;
  variants: CosmeticDetailVariant[];
  categoryIds: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCosmeticPayload {
  name: string;
  brand?: string;
  origin?: string;
  description?: string;
  imageUrl?: string;
  categoryIds?: string[];
}

export interface UpdateVariantPayload {
  name: string;
  color?: string;
  volume?: string;
  price: number;
  costPrice?: number;
}

export const productsService = {
  async getCosmetics(search?: string): Promise<CosmeticSummary[]> {
    const { data } = await api.get<CosmeticSummary[]>("/cosmetics", {
      params: search ? { search } : undefined,
    });
    return data;
  },

  async getCosmeticById(id: string): Promise<CosmeticDetail> {
    const { data } = await api.get<CosmeticDetail>(`/cosmetics/${id}`);
    return data;
  },

  async getCategories(): Promise<CategorySummary[]> {
    const { data } = await api.get<CategorySummary[]>("/categories");
    return data;
  },

  async createCategory(payload: { name: string; description?: string }): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>("/categories", payload);
    return data;
  },

  async updateCategory(id: string, payload: { name: string; description?: string }): Promise<void> {
    await api.put<void>(`/categories/${id}`, payload);
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete<void>(`/categories/${id}`);
  },

  async activateCategory(id: string): Promise<void> {
    await api.patch<void>(`/categories/${id}/activate`);
  },

  async deactivateCategory(id: string): Promise<void> {
    await api.patch<void>(`/categories/${id}/deactivate`);
  },

  async createCosmetic(payload: CreateCosmeticPayload): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>("/cosmetics", payload);
    return data;
  },

  async updateCosmetic(id: string, payload: UpdateCosmeticPayload): Promise<void> {
    await api.put<void>(`/cosmetics/${id}`, payload);
  },

  async deleteCosmetic(id: string): Promise<void> {
    await api.delete<void>(`/cosmetics/${id}`);
  },

  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.post<{ imageUrl: string }>("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async addVariant(cosmeticId: string, payload: CreateVariantPayload): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>(`/cosmetics/${cosmeticId}/variants`, payload);
    return data;
  },

  async updateVariant(variantId: string, payload: UpdateVariantPayload): Promise<void> {
    await api.put<void>(`/cosmetics/variants/${variantId}`, payload);
  },

  async activateVariant(variantId: string): Promise<void> {
    await api.patch<void>(`/cosmetics/variants/${variantId}/activate`);
  },

  async deactivateVariant(variantId: string): Promise<void> {
    await api.patch<void>(`/cosmetics/variants/${variantId}/deactivate`);
  },
};
import { productsService } from "../../../../services/products.service";
import type { CategorySummary, CreateCosmeticPayload } from "./type";

export const addProductApi = {
  getCategories: (): Promise<CategorySummary[]> => productsService.getCategories(),
  createCosmetic: (payload: CreateCosmeticPayload): Promise<any> => productsService.createCosmetic(payload),
  uploadImage: (file: File): Promise<{ imageUrl: string }> => productsService.uploadImage(file),
};

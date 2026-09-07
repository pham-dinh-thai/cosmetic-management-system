import { productsService } from "../../../../services/products.service";
import type {
  CategorySummary,
  CreateVariantPayload,
  UpdateCosmeticPayload,
  UpdateVariantPayload,
} from "./type";

export const editProductApi = {
  getCosmeticById: (id: string) => productsService.getCosmeticById(id),
  getCategories: (): Promise<CategorySummary[]> => productsService.getCategories(),
  updateCosmetic: (id: string, payload: UpdateCosmeticPayload) =>
    productsService.updateCosmetic(id, payload),
  updateVariant: (variantId: string, payload: UpdateVariantPayload) =>
    productsService.updateVariant(variantId, payload),
  activateVariant: (variantId: string) => productsService.activateVariant(variantId),
  deactivateVariant: (variantId: string) => productsService.deactivateVariant(variantId),
  addVariant: (productId: string, payload: CreateVariantPayload) =>
    productsService.addVariant(productId, payload),
  uploadImage: (file: File): Promise<{ imageUrl: string }> =>
    productsService.uploadImage(file),
};

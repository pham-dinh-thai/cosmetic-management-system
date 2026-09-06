import { productsService } from "../../../../services/products.service";
import type { CategorySummary, CreateCategoryPayload, UpdateCategoryPayload } from "./type";

export const categoriesApi = {
  getCategories: (): Promise<CategorySummary[]> => productsService.getCategories(),
  createCategory: (payload: CreateCategoryPayload) => productsService.createCategory(payload),
  updateCategory: (id: string, payload: UpdateCategoryPayload) =>
    productsService.updateCategory(id, payload),
  deleteCategory: (id: string) => productsService.deleteCategory(id),
  activateCategory: (id: string) => productsService.activateCategory(id),
  deactivateCategory: (id: string) => productsService.deactivateCategory(id),
};

import type { CategorySummary as ServiceCategorySummary } from "../../../../services/products.service";

export type StatusFilter = "all" | "active" | "inactive";
export type CategorySummary = ServiceCategorySummary;

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name: string;
  description?: string;
}

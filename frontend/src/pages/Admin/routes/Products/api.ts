import { productsService } from "../../../../services/products.service";
import type { CosmeticSummary } from "./type";

export const productsApi = {
  getCosmetics: (): Promise<CosmeticSummary[]> => productsService.getCosmetics(),
  deleteCosmetic: (id: string): Promise<void> => productsService.deleteCosmetic(id),
  activateCosmetic: (id: string): Promise<void> => productsService.activateCosmetic(id),
  deactivateCosmetic: (id: string): Promise<void> => productsService.deactivateCosmetic(id),
};

import { productsService } from "../../../../services/products.service";
import type { CosmeticDetail } from "./type";

export const productDetailApi = {
  getCosmeticById: (id: string): Promise<CosmeticDetail> =>
    productsService.getCosmeticById(id),
};

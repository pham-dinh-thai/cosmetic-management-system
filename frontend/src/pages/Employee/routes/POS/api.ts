import { productsService } from "../../../../services/products.service";
import { customersService } from "../../../../services/customers.service";
import { ordersService } from "../../../../services/orders.service";
import type { CreatePosOrderPayload } from "../../../../services/orders.service";

export const posApi = {
  getCosmetics: () => productsService.getCosmetics(),
  getCosmeticById: (id: string) => productsService.getCosmeticById(id),
  searchCustomers: (q?: string) => customersService.getCustomers(q),
  createCustomer: customersService.createCustomer,
  createOrder: (payload: CreatePosOrderPayload) => ordersService.createOrder(payload),
};
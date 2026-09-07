import type { CosmeticDetail, CosmeticSummary } from "../../../../services/products.service";
import type { CustomerSummary } from "../../../../services/customers.service";
import type { PaymentMethod } from "../../../../services/orders.service";

export interface CartItem {
  variantId: string;
  cosmeticId: string;
  productName: string;
  variantName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
}

export interface NewCustomerDraft {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface PaymentOption {
  value: PaymentMethod;
  label: string;
}

export type {
  CosmeticDetail,
  CosmeticSummary,
  CustomerSummary,
  PaymentMethod,
};
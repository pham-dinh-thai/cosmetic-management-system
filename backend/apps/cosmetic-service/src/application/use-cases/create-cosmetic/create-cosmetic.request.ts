export interface ICreateVariantRequest {
  name: string;
  color?: string;
  volume?: string;
  price: number;
  costPrice?: number;
}

export interface ICreateCosmeticRequest {
  name: string;
  brand?: string;
  origin?: string;
  description?: string;
  imageUrl?: string;
  variants: ICreateVariantRequest[];
  categoryIds: string[];
}

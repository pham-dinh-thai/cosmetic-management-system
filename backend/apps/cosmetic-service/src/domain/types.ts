export type CreateVariantProps = {
  name: string;
  color: string | null;
  volume: string | null;
  price: number;
  costPrice: number | null;
};

export type CreateCosmeticProps = {
  code: string;
  name: string;
  brand: string | null;
  origin: string | null;
  description: string | null;
  imageUrl: string | null;
  variants: CreateVariantProps[];
  categoryIds: string[];
};

export type FromPersistentVariantProps = {
  id: string;
  cosmeticId: string;
  name: string;
  color: string | null;
  volume: string | null;
  price: number;
  costPrice: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FromPersistentCosmeticProps = {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  origin: string | null;
  description: string | null;
  imageUrl: string | null;
  variants: FromPersistentVariantProps[];
  categoryIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

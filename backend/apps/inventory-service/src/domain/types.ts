export type CreateInventoryProps = {
  variantId: string;
  quantity: number;
};

export type FromPersistentInventoryProps = {
  id: string;
  variantId: string;
  quantity: number;
  lastUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCategoryProps = {
  name: string;
  description: string | null;
};

export type UpdateCategoryProps = {
  name: string;
  description: string | null;
};

export type FromPersistentCategoryProps = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

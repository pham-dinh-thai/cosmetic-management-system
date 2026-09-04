import { Category } from '../category.aggregate';

export interface ICategoriesRepository {
  findAll(search?: string): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  create(category: Category): Promise<{ id: string }>;
  update(
    id: string,
    data: { name: string; description: string | null },
  ): Promise<Category | null>;
  activate(id: string): Promise<Category | null>;
  deactivate(id: string): Promise<Category | null>;
  delete(id: string): Promise<Category | null>;
}

export const CATEGORIES_REPOSITORY = 'ICategoriesRepository';

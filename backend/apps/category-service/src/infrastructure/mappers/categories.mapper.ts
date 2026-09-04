import { Category } from '../../domain/category.aggregate';
import { Category as CategoryMikro } from '../entities/category.entity';

export class CategoriesMapper {
  public static toDomain(categoryMikro: CategoryMikro): Category {
    return Category.fromPersistent({
      id: categoryMikro.id,
      name: categoryMikro.name,
      description: categoryMikro.description ?? null,
      isActive: categoryMikro.isActive,
      createdAt: categoryMikro.createdAt,
      updatedAt: categoryMikro.updatedAt,
    });
  }

  public static toMikro(category: Category): CategoryMikro {
    const categoryMikro = new CategoryMikro();

    categoryMikro.name = category.getName();
    categoryMikro.description = category.getDescription();

    return categoryMikro;
  }
}

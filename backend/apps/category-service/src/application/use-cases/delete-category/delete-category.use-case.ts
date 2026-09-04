import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';
import { type ICategoriesRepository } from '../../../domain/repositories/categories.repository';

export class DeleteCategoryUseCase {
  public constructor(
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.categoriesRepository.delete(id);

    if (!deleted) {
      throw new CategoryNotFoundException(id);
    }
  }
}

export const deleteCategoryUseCaseFactory = (
  categoriesRepository: ICategoriesRepository,
): DeleteCategoryUseCase => new DeleteCategoryUseCase(categoriesRepository);

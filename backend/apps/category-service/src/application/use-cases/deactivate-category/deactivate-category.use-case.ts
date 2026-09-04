import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';
import { type ICategoriesRepository } from '../../../domain/repositories/categories.repository';

export class DeactivateCategoryUseCase {
  public constructor(
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const category = await this.categoriesRepository.deactivate(id);

    if (!category) {
      throw new CategoryNotFoundException(id);
    }
  }
}

export const deactivateCategoryUseCaseFactory = (
  categoriesRepository: ICategoriesRepository,
): DeactivateCategoryUseCase =>
  new DeactivateCategoryUseCase(categoriesRepository);

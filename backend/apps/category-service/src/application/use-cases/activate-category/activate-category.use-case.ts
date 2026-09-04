import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';
import { type ICategoriesRepository } from '../../../domain/repositories/categories.repository';

export class ActivateCategoryUseCase {
  public constructor(
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const category = await this.categoriesRepository.activate(id);

    if (!category) {
      throw new CategoryNotFoundException(id);
    }
  }
}

export const activateCategoryUseCaseFactory = (
  categoriesRepository: ICategoriesRepository,
): ActivateCategoryUseCase => new ActivateCategoryUseCase(categoriesRepository);

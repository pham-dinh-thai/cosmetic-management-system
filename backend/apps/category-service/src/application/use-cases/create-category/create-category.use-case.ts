import { ICreateCategoryRequest } from './create-category.request';
import { Category } from '../../../domain/category.aggregate';
import { DuplicateCategoryNameException } from '../../../domain/exceptions/duplicate-category-name.exception';
import { type ICategoriesRepository } from '../../../domain/repositories/categories.repository';

export class CreateCategoryUseCase {
  public constructor(
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(
    request: ICreateCategoryRequest,
  ): Promise<{ id: string }> {
    const existing = await this.categoriesRepository.findByName(request.name);

    if (existing) {
      throw new DuplicateCategoryNameException(request.name);
    }

    const category = Category.create({
      name: request.name,
      description: request.description ?? null,
    });

    return await this.categoriesRepository.create(category);
  }
}

export const createCategoryUseCaseFactory = (
  categoriesRepository: ICategoriesRepository,
): CreateCategoryUseCase => new CreateCategoryUseCase(categoriesRepository);

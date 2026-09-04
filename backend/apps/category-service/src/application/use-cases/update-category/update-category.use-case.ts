import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';
import { DuplicateCategoryNameException } from '../../../domain/exceptions/duplicate-category-name.exception';
import { type ICategoriesRepository } from '../../../domain/repositories/categories.repository';
import { IUpdateCategoryRequest } from './update-category.request';

export class UpdateCategoryUseCase {
  public constructor(
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateCategoryRequest,
  ): Promise<void> {
    const existing = await this.categoriesRepository.findById(id);

    if (!existing) {
      throw new CategoryNotFoundException(id);
    }

    if (request.name !== existing.getName()) {
      const duplicate = await this.categoriesRepository.findByName(
        request.name,
      );

      if (duplicate) {
        throw new DuplicateCategoryNameException(request.name);
      }
    }

    await this.categoriesRepository.update(id, {
      name: request.name,
      description: request.description ?? null,
    });
  }
}

export const updateCategoryUseCaseFactory = (
  categoriesRepository: ICategoriesRepository,
): UpdateCategoryUseCase => new UpdateCategoryUseCase(categoriesRepository);

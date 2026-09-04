import { type ICategoriesRepository } from '../../../../domain/repositories/categories.repository';
import { FindCategoryByIdReadModel } from './read-models/find-category-by-id.read-model';

export class FindCategoryByIdUseCase {
  public constructor(
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(id: string): Promise<FindCategoryByIdReadModel | null> {
    const category = await this.categoriesRepository.findById(id);

    return category
      ? new FindCategoryByIdReadModel(
          category.getId(),
          category.getName(),
          category.getDescription(),
          category.getIsActive(),
          category.getCreatedAt(),
          category.getUpdatedAt(),
        )
      : null;
  }
}

export const findCategoryByIdUseCaseFactory = (
  categoriesRepository: ICategoriesRepository,
): FindCategoryByIdUseCase => new FindCategoryByIdUseCase(categoriesRepository);

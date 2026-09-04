import { type ICategoriesRepository } from '../../../../domain/repositories/categories.repository';
import { FindAllCategoryReadModel } from './read-models/find-all-category.read-model';

export class FindAllCategoriesUseCase {
  public constructor(
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(search?: string): Promise<FindAllCategoryReadModel[]> {
    const categories = await this.categoriesRepository.findAll(search);

    return categories.map(
      (category) =>
        new FindAllCategoryReadModel(
          category.getId(),
          category.getName(),
          category.getDescription(),
          category.getIsActive(),
          category.getCreatedAt(),
          category.getUpdatedAt(),
        ),
    );
  }
}

export const findAllCategoriesUseCaseFactory = (
  categoriesRepository: ICategoriesRepository,
): FindAllCategoriesUseCase =>
  new FindAllCategoriesUseCase(categoriesRepository);

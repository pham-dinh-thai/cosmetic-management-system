import { type ISuppliersRepository } from '../../../../domain/repositories/suppliers.repository';
import { FindAllSupplierReadModel } from './read-models/find-all-supplier.read-model';

export class FindAllSuppliersUseCase {
  public constructor(
    private readonly suppliersRepository: ISuppliersRepository,
  ) {}

  public async execute(search?: string): Promise<FindAllSupplierReadModel[]> {
    const suppliers = await this.suppliersRepository.findAll(search);

    return suppliers.map(
      (supplier) =>
        new FindAllSupplierReadModel(
          supplier.getId(),
          supplier.getCode(),
          supplier.getName(),
          supplier.getEmail(),
          supplier.getPhone(),
          supplier.getAddress(),
          supplier.getIsActive(),
          supplier.getCreatedAt(),
          supplier.getUpdatedAt(),
        ),
    );
  }
}

export const findAllSuppliersUseCaseFactory = (
  suppliersRepository: ISuppliersRepository,
): FindAllSuppliersUseCase => new FindAllSuppliersUseCase(suppliersRepository);
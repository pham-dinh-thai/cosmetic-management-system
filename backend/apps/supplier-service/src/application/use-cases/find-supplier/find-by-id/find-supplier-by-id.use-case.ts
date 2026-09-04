import { type ISuppliersRepository } from '../../../../domain/repositories/suppliers.repository';
import { FindSupplierByIdReadModel } from './read-models/find-supplier-by-id.read-model';

export class FindSupplierByIdUseCase {
  public constructor(
    private readonly suppliersRepository: ISuppliersRepository,
  ) {}

  public async execute(id: string): Promise<FindSupplierByIdReadModel | null> {
    const supplier = await this.suppliersRepository.findById(id);

    return supplier
      ? new FindSupplierByIdReadModel(
          supplier.getId(),
          supplier.getCode(),
          supplier.getName(),
          supplier.getEmail(),
          supplier.getPhone(),
          supplier.getAddress(),
          supplier.getIsActive(),
          supplier.getCreatedAt(),
          supplier.getUpdatedAt(),
        )
      : null;
  }
}

export const findSupplierByIdUseCaseFactory = (
  suppliersRepository: ISuppliersRepository,
): FindSupplierByIdUseCase => new FindSupplierByIdUseCase(suppliersRepository);
